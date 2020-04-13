import inherits from 'inherits';
import lodash from 'lodash';
import events from 'events';
import debug$2 from 'debug';
import uuid from 'uuid';
import util from 'util';
import stream from 'stream';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import os from 'os';
import mkdirp from 'mkdirp';
import tarn from 'tarn';
import colorette from 'colorette';
import url from 'url';
import pgConnectionString from 'pg-connection-string';

function commonjsRequire() {
  throw new Error(
    'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
  );
}

const { keys } = lodash;

// The client names we'll allow in the `{name: lib}` pairing.
const CLIENT_ALIASES = Object.freeze({
  pg: 'postgres',
  postgresql: 'postgres',
  sqlite: 'sqlite3',
});

const SUPPORTED_CLIENTS = Object.freeze(
  [
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'postgres',
    'redshift',
    'sqlite3',
  ].concat(keys(CLIENT_ALIASES))
);

const POOL_CONFIG_OPTIONS = Object.freeze([
  'maxWaitingClients',
  'testOnBorrow',
  'fifo',
  'priorityRange',
  'autostart',
  'evictionRunIntervalMillis',
  'numTestsPerRun',
  'softIdleTimeoutMillis',
  'Promise',
]);

var constants = {
  CLIENT_ALIASES,
  SUPPORTED_CLIENTS,
  POOL_CONFIG_OPTIONS,
};

/* eslint no-console:0 */

const {
  isFunction,
  isUndefined,
  isPlainObject,
  isArray,
  isTypedArray,
} = lodash;
const { CLIENT_ALIASES: CLIENT_ALIASES$1 } = constants;

// Check if the first argument is an array, otherwise uses all arguments as an
// array.

function normalizeArr() {
  const args = new Array(arguments.length);
  for (let i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  if (Array.isArray(args[0])) {
    return args[0];
  }
  return args;
}

function containsUndefined(mixed) {
  let argContainsUndefined = false;

  if (isTypedArray(mixed)) return false;

  if (mixed && isFunction(mixed.toSQL)) {
    //Any QueryBuilder or Raw will automatically be validated during compile.
    return argContainsUndefined;
  }

  if (isArray(mixed)) {
    for (let i = 0; i < mixed.length; i++) {
      if (argContainsUndefined) break;
      argContainsUndefined = containsUndefined(mixed[i]);
    }
  } else if (isPlainObject(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (!argContainsUndefined) {
        argContainsUndefined = containsUndefined(mixed[key]);
      }
    });
  } else {
    argContainsUndefined = isUndefined(mixed);
  }

  return argContainsUndefined;
}

function getUndefinedIndices(mixed) {
  const indices = [];

  if (Array.isArray(mixed)) {
    mixed.forEach((item, index) => {
      if (containsUndefined(item)) {
        indices.push(index);
      }
    });
  } else if (isPlainObject(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (containsUndefined(mixed[key])) {
        indices.push(key);
      }
    });
  } else {
    indices.push(0);
  }

  return indices;
}

function addQueryContext(Target) {
  // Stores or returns (if called with no arguments) context passed to
  // wrapIdentifier and postProcessResponse hooks
  Target.prototype.queryContext = function(context) {
    if (isUndefined(context)) {
      return this._queryContext;
    }
    this._queryContext = context;
    return this;
  };
}

function resolveClientNameWithAliases(clientName) {
  return CLIENT_ALIASES$1[clientName] || clientName;
}

var helpers = {
  addQueryContext,
  containsUndefined,
  normalizeArr,
  resolveClientNameWithAliases,
  getUndefinedIndices,
};

var saveAsyncStack = function saveAsyncStack(instance, lines) {
  if (instance.client.config.asyncStackTraces) {
    // a hack to get a callstack into the client code despite this
    // node.js bug https://github.com/nodejs/node/issues/11865
    const stackByLines = new Error().stack.split('\n');
    stackByLines.splice(0, lines);
    instance._asyncStack = stackByLines;
  }
};

var noop = function() {};

const finallyMixin = (prototype) =>
  Object.assign(prototype, {
    finally(onFinally) {
      return this.then().finally(onFinally);
    },
  });

// FYI: Support for `Promise.prototype.finally` was not introduced until Node 9.
//      Therefore, Knex will need to conditionally inject support for `.finally(..)`
//      until support for Node 8 is officially dropped.
var finallyMixin_1 = Promise.prototype.finally ? noop : finallyMixin;

const { isEmpty, map, clone } = lodash;
const { callbackify } = util;

var _interface = function(Target) {
  Target.prototype.toQuery = function(tz) {
    let data = this.toSQL(this._method, tz);
    if (!Array.isArray(data)) data = [data];
    return map(data, (statement) => {
      return this.client._formatQuery(statement.sql, statement.bindings, tz);
    }).join(';\n');
  };

  // Create a new instance of the `Runner`, passing in the current object.
  Target.prototype.then = function(/* onFulfilled, onRejected */) {
    let result = this.client.runner(this).run();

    if (this.client.config.asyncStackTraces) {
      result = result.catch((err) => {
        err.originalStack = err.stack;
        const firstLine = err.stack.split('\n')[0];
        this._asyncStack.unshift(firstLine);
        // put the fake more helpful "async" stack on the thrown error
        err.stack = this._asyncStack.join('\n');
        throw err;
      });
    }

    return result.then.apply(result, arguments);
  };

  // Add additional "options" to the builder. Typically used for client specific
  // items, like the `mysql` and `sqlite3` drivers.
  Target.prototype.options = function(opts) {
    this._options = this._options || [];
    this._options.push(clone(opts) || {});
    return this;
  };

  // Sets an explicit "connection" we wish to use for this query.
  Target.prototype.connection = function(connection) {
    this._connection = connection;
    return this;
  };

  // Set a debug flag for the current schema query stack.
  Target.prototype.debug = function(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  };

  // Set the transaction object for this query.
  Target.prototype.transacting = function(t) {
    if (t && t.client) {
      if (!t.client.transacting) {
        t.client.logger.warn(`Invalid transaction value: ${t.client}`);
      } else {
        this.client = t.client;
      }
    }
    if (isEmpty(t)) {
      this.client.logger.error(
        'Invalid value on transacting call, potential bug'
      );
      throw Error(
        'Invalid transacting value (null, undefined or empty object)'
      );
    }
    return this;
  };

  // Initializes a stream.
  Target.prototype.stream = function(options) {
    return this.client.runner(this).stream(options);
  };

  // Initialize a stream & pipe automatically.
  Target.prototype.pipe = function(writable, options) {
    return this.client.runner(this).pipe(
      writable,
      options
    );
  };

  Target.prototype.asCallback = function(cb) {
    const promise = this.then();
    callbackify(() => promise)(cb);
    return promise;
  };

  Target.prototype.catch = function(onReject) {
    return this.then().catch(onReject);
  };

  Object.defineProperty(Target.prototype, Symbol.toStringTag, {
    get: () => 'object',
  });

  finallyMixin_1(Target.prototype);
};

// Raw
// -------

const { EventEmitter } = events;

const {
  assign,
  reduce,
  isPlainObject: isPlainObject$1,
  isObject,
  isUndefined: isUndefined$1,
  isNumber,
} = lodash;

const debugBindings = debug$2('knex:bindings');

function Raw(client) {
  this.client = client;

  this.sql = '';
  this.bindings = [];

  // Todo: Deprecate
  this._wrappedBefore = undefined;
  this._wrappedAfter = undefined;
  if (client && client.config) {
    this._debug = client.config.debug;
    saveAsyncStack(this, 4);
  }
}

inherits(Raw, EventEmitter);

assign(Raw.prototype, {
  set(sql, bindings) {
    this.sql = sql;
    this.bindings =
      (isObject(bindings) && !bindings.toSQL) || isUndefined$1(bindings)
        ? bindings
        : [bindings];

    return this;
  },

  timeout(ms, { cancel } = {}) {
    if (isNumber(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  },

  // Wraps the current sql with `before` and `after`.
  wrap(before, after) {
    this._wrappedBefore = before;
    this._wrappedAfter = after;
    return this;
  },

  // Calls `toString` on the Knex object.
  toString() {
    return this.toQuery();
  },

  // Returns the raw sql for the query.
  toSQL(method, tz) {
    let obj;
    const formatter = this.client.formatter(this);

    if (Array.isArray(this.bindings)) {
      obj = replaceRawArrBindings(this, formatter);
    } else if (this.bindings && isPlainObject$1(this.bindings)) {
      obj = replaceKeyBindings(this, formatter);
    } else {
      obj = {
        method: 'raw',
        sql: this.sql,
        bindings: isUndefined$1(this.bindings) ? [] : [this.bindings],
      };
    }

    if (this._wrappedBefore) {
      obj.sql = this._wrappedBefore + obj.sql;
    }
    if (this._wrappedAfter) {
      obj.sql = obj.sql + this._wrappedAfter;
    }

    obj.options = reduce(this._options, assign, {});

    if (this._timeout) {
      obj.timeout = this._timeout;
      if (this._cancelOnTimeout) {
        obj.cancelOnTimeout = this._cancelOnTimeout;
      }
    }

    obj.bindings = obj.bindings || [];
    if (helpers.containsUndefined(obj.bindings)) {
      const undefinedBindingIndices = helpers.getUndefinedIndices(
        this.bindings
      );
      debugBindings(obj.bindings);
      throw new Error(
        `Undefined binding(s) detected for keys [${undefinedBindingIndices}] when compiling RAW query: ${obj.sql}`
      );
    }

    obj.__knexQueryUid = uuid.v1();

    return obj;
  },
});

function replaceRawArrBindings(raw, formatter) {
  const expectedBindings = raw.bindings.length;
  const values = raw.bindings;
  let index = 0;

  const sql = raw.sql.replace(/\\?\?\??/g, function(match) {
    if (match === '\\?') {
      return match;
    }

    const value = values[index++];

    if (match === '??') {
      return formatter.columnize(value);
    }
    return formatter.parameter(value);
  });

  if (expectedBindings !== index) {
    throw new Error(`Expected ${expectedBindings} bindings, saw ${index}`);
  }

  return {
    method: 'raw',
    sql,
    bindings: formatter.bindings,
  };
}

function replaceKeyBindings(raw, formatter) {
  const values = raw.bindings;
  const regex = /\\?(:(\w+):(?=::)|:(\w+):(?!:)|:(\w+))/g;

  const sql = raw.sql.replace(regex, function(match, p1, p2, p3, p4) {
    if (match !== p1) {
      return p1;
    }

    const part = p2 || p3 || p4;
    const key = match.trim();
    const isIdentifier = key[key.length - 1] === ':';
    const value = values[part];

    if (value === undefined) {
      if (Object.prototype.hasOwnProperty.call(values, part)) {
        formatter.bindings.push(value);
      }

      return match;
    }

    if (isIdentifier) {
      return match.replace(p1, formatter.columnize(value));
    }

    return match.replace(p1, formatter.parameter(value));
  });

  return {
    method: 'raw',
    sql,
    bindings: formatter.bindings,
  };
}

// Allow the `Raw` object to be utilized with full access to the relevant
// promise API.
_interface(Raw);
helpers.addQueryContext(Raw);

var raw = Raw;

class Ref extends raw {
  constructor(client, ref) {
    super(client);

    this.ref = ref;
    this._schema = null;
    this._alias = null;
  }

  withSchema(schema) {
    this._schema = schema;

    return this;
  }

  as(alias) {
    this._alias = alias;

    return this;
  }

  toSQL() {
    const string = this._schema ? `${this._schema}.${this.ref}` : this.ref;

    const formatter = this.client.formatter(this);

    const ref = formatter.columnize(string);

    const sql = this._alias ? `${ref} as ${formatter.wrap(this._alias)}` : ref;

    this.set(sql, []);

    return super.toSQL(...arguments);
  }
}

var ref = Ref;

class KnexTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KnexTimeoutError';
  }
}

function timeout(promise, ms) {
  return new Promise(function(resolve, reject) {
    const id = setTimeout(function() {
      reject(new KnexTimeoutError('operation timed out'));
    }, ms);

    function wrappedResolve(value) {
      clearTimeout(id);
      resolve(value);
    }

    function wrappedReject(err) {
      clearTimeout(id);
      reject(err);
    }

    promise.then(wrappedResolve, wrappedReject);
  });
}

var KnexTimeoutError_1 = KnexTimeoutError;
var timeout_2 = timeout;

var timeout_1 = {
  KnexTimeoutError: KnexTimeoutError_1,
  timeout: timeout_2,
};

const { KnexTimeoutError: KnexTimeoutError$1 } = timeout_1;
const { timeout: timeout$1 } = timeout_1;

let PassThrough;

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.
function Runner(client, builder) {
  this.client = client;
  this.builder = builder;
  this.queries = [];

  // The "connection" object is set on the runner when
  // "run" is called.
  this.connection = void 0;
}

Object.assign(Runner.prototype, {
  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.
  run() {
    const runner = this;
    return (
      this.ensureConnection(function(connection) {
        runner.connection = connection;

        runner.client.emit('start', runner.builder);
        runner.builder.emit('start', runner.builder);
        const sql = runner.builder.toSQL();

        if (runner.builder._debug) {
          runner.client.logger.debug(sql);
        }

        if (Array.isArray(sql)) {
          return runner.queryArray(sql);
        }
        return runner.query(sql);
      })

        // If there are any "error" listeners, we fire an error event
        // and then re-throw the error to be eventually handled by
        // the promise chain. Useful if you're wrapping in a custom `Promise`.
        .catch(function(err) {
          if (runner.builder._events && runner.builder._events.error) {
            runner.builder.emit('error', err);
          }
          throw err;
        })

        // Fire a single "end" event on the builder when
        // all queries have successfully completed.
        .then(function(res) {
          runner.builder.emit('end');
          return res;
        })
    );
  },

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are
  stream(options, handler) {
    // If we specify stream(handler).then(...
    if (arguments.length === 1) {
      if (typeof options === 'function') {
        handler = options;
        options = {};
      }
    }

    // Determines whether we emit an error or throw here.
    const hasHandler = typeof handler === 'function';

    // Lazy-load the "PassThrough" dependency.
    PassThrough = PassThrough || stream.PassThrough;

    const runner = this;
    const stream$1 = new PassThrough({ objectMode: true });

    let hasConnection = false;
    const promise = this.ensureConnection(function(connection) {
      hasConnection = true;
      runner.connection = connection;
      try {
        const sql = runner.builder.toSQL();

        if (Array.isArray(sql) && hasHandler) {
          throw new Error(
            'The stream may only be used with a single query statement.'
          );
        }

        return runner.client.stream(runner.connection, sql, stream$1, options);
      } catch (e) {
        stream$1.emit('error', e);
        throw e;
      }
    });

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itself.
    if (hasHandler) {
      handler(stream$1);
      return promise;
    }

    // Emit errors on the stream if the error occurred before a connection
    // could be acquired.
    // If the connection was acquired, assume the error occurred in the client
    // code and has already been emitted on the stream. Don't emit it twice.
    promise.catch(function(err) {
      if (!hasConnection) stream$1.emit('error', err);
    });
    return stream$1;
  },

  // Allow you to pipe the stream to a writable stream.
  pipe(writable, options) {
    return this.stream(options).pipe(writable);
  },

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.
  query: async function(obj) {
    const { __knexUid, __knexTxId } = this.connection;

    this.builder.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));

    const runner = this;
    let queryPromise = this.client.query(this.connection, obj);

    if (obj.timeout) {
      queryPromise = timeout$1(queryPromise, obj.timeout);
    }

    // Await the return value of client.processResponse; in the case of sqlite3's
    // dropColumn()/renameColumn(), it will be a Promise for the transaction
    // containing the complete rename procedure.
    return queryPromise
      .then((resp) => this.client.processResponse(resp, runner))
      .then((processedResponse) => {
        const queryContext = this.builder.queryContext();
        const postProcessedResponse = this.client.postProcessResponse(
          processedResponse,
          queryContext
        );

        this.builder.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj),
          this.builder
        );

        this.client.emit(
          'query-response',
          postProcessedResponse,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj),
          this.builder
        );

        return postProcessedResponse;
      })
      .catch((error) => {
        if (!(error instanceof KnexTimeoutError$1)) {
          return Promise.reject(error);
        }
        const { timeout, sql, bindings } = obj;

        let cancelQuery;
        if (obj.cancelOnTimeout) {
          cancelQuery = this.client.cancelQuery(this.connection);
        } else {
          // If we don't cancel the query, we need to mark the connection as disposed so that
          // it gets destroyed by the pool and is never used again. If we don't do this and
          // return the connection to the pool, it will be useless until the current operation
          // that timed out, finally finishes.
          this.connection.__knex__disposed = error;
          cancelQuery = Promise.resolve();
        }

        return cancelQuery
          .catch((cancelError) => {
            // If the cancellation failed, we need to mark the connection as disposed so that
            // it gets destroyed by the pool and is never used again. If we don't do this and
            // return the connection to the pool, it will be useless until the current operation
            // that timed out, finally finishes.
            this.connection.__knex__disposed = error;

            // cancellation failed
            throw Object.assign(cancelError, {
              message: `After query timeout of ${timeout}ms exceeded, cancelling of query failed.`,
              sql,
              bindings,
              timeout,
            });
          })
          .then(() => {
            // cancellation succeeded, rethrow timeout error
            throw Object.assign(error, {
              message: `Defined query timeout of ${timeout}ms exceeded when running query.`,
              sql,
              bindings,
              timeout,
            });
          });
      })
      .catch((error) => {
        this.builder.emit(
          'query-error',
          error,
          Object.assign({ __knexUid: this.connection.__knexUid }, obj)
        );
        throw error;
      });
  },

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.
  async queryArray(queries) {
    if (queries.length === 1) {
      return this.query(queries[0]);
    }

    const results = [];
    for (const query of queries) {
      results.push(await this.query(query));
    }
    return results;
  },

  // Check whether there's a transaction flag, and that it has a connection.
  async ensureConnection(cb) {
    // Use override from a builder if passed
    if (this.builder._connection) {
      return cb(this.builder._connection);
    }

    if (this.connection) {
      return cb(this.connection);
    }
    return this.client
      .acquireConnection()
      .catch((error) => {
        if (!(error instanceof KnexTimeoutError$1)) {
          return Promise.reject(error);
        }
        if (this.builder) {
          error.sql = this.builder.sql;
          error.bindings = this.builder.bindings;
        }
        throw error;
      })
      .then(async (connection) => {
        try {
          return await cb(connection);
        } finally {
          await this.client.releaseConnection(this.connection);
        }
      });
  },
});

var runner = Runner;

// JoinClause
// -------

// The "JoinClause" is an object holding any necessary info about a join,
// including the type, and any associated tables & columns being joined.
function JoinClause(table, type, schema) {
  this.schema = schema;
  this.table = table;
  this.joinType = type;
  this.and = this;
  this.clauses = [];
}

function getClauseFromArguments(compilerType, bool, first, operator, second) {
  let data = null;

  if (typeof first === 'function') {
    data = {
      type: 'onWrapped',
      value: first,
      bool: bool,
    };
  } else {
    switch (arguments.length) {
      case 3: {
        data = { type: 'onRaw', value: first, bool };
        break;
      }
      case 4:
        data = {
          type: compilerType,
          column: first,
          operator: '=',
          value: operator,
          bool,
        };
        break;
      default:
        data = {
          type: compilerType,
          column: first,
          operator,
          value: second,
          bool,
        };
    }
  }

  return data;
}

Object.assign(JoinClause.prototype, {
  grouping: 'join',

  // Adds an "on" clause to the current join object.
  on(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOn' : 'on';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onBasic', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  // Adds a "using" clause to the current join.
  using(column) {
    return this.clauses.push({ type: 'onUsing', column, bool: this._bool() });
  },

  /*// Adds an "and on" clause to the current join object.
  andOn() {
    return this.on.apply(this, arguments);
  },*/

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    return this._bool('or').on.apply(this, arguments);
  },

  onVal(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOnVal' : 'onVal';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onVal', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  andOnVal() {
    return this.onVal(...arguments);
  },

  orOnVal() {
    return this._bool('or').onVal(...arguments);
  },

  onBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to onBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the onBetween clause'
    );
    this.clauses.push({
      type: 'onBetween',
      column,
      value: values,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  onNotBetween(column, values) {
    return this._not(true).onBetween(column, values);
  },

  orOnBetween(column, values) {
    return this._bool('or').onBetween(column, values);
  },

  orOnNotBetween(column, values) {
    return this._bool('or')
      ._not(true)
      .onBetween(column, values);
  },

  onIn(column, values) {
    if (Array.isArray(values) && values.length === 0) return this.on(1, '=', 0);
    this.clauses.push({
      type: 'onIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  onNotIn(column, values) {
    return this._not(true).onIn(column, values);
  },

  orOnIn(column, values) {
    return this._bool('or').onIn(column, values);
  },

  orOnNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .onIn(column, values);
  },

  onNull(column) {
    this.clauses.push({
      type: 'onNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnNull(callback) {
    return this._bool('or').onNull(callback);
  },

  onNotNull(callback) {
    return this._not(true).onNull(callback);
  },

  orOnNotNull(callback) {
    return this._not(true)
      ._bool('or')
      .onNull(callback);
  },

  onExists(callback) {
    this.clauses.push({
      type: 'onExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnExists(callback) {
    return this._bool('or').onExists(callback);
  },

  onNotExists(callback) {
    return this._not(true).onExists(callback);
  },

  orOnNotExists(callback) {
    return this._not(true)
      ._bool('or')
      .onExists(callback);
  },

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  },

  _bool(bool) {
    if (arguments.length === 1) {
      this._boolFlag = bool;
      return this;
    }
    const ret = this._boolFlag || 'and';
    this._boolFlag = 'and';
    return ret;
  },

  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },
});

Object.defineProperty(JoinClause.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

JoinClause.prototype.andOn = JoinClause.prototype.on;
JoinClause.prototype.andOnIn = JoinClause.prototype.onIn;
JoinClause.prototype.andOnNotIn = JoinClause.prototype.onNotIn;
JoinClause.prototype.andOnNull = JoinClause.prototype.onNull;
JoinClause.prototype.andOnNotNull = JoinClause.prototype.onNotNull;
JoinClause.prototype.andOnExists = JoinClause.prototype.onExists;
JoinClause.prototype.andOnNotExists = JoinClause.prototype.onNotExists;
JoinClause.prototype.andOnBetween = JoinClause.prototype.onBetween;
JoinClause.prototype.andOnNotBetween = JoinClause.prototype.onNotBetween;

var joinclause = JoinClause;

/**
 * internal constants, do not use in application code
 */
var constants$1 = {
  lockMode: {
    forShare: 'forShare',
    forUpdate: 'forUpdate',
  },
  waitMode: {
    skipLocked: 'skipLocked',
    noWait: 'noWait',
  },
};

// Builder
// -------

const { EventEmitter: EventEmitter$1 } = events;

const {
  assign: assign$1,
  clone: clone$1,
  each,
  isBoolean,
  isEmpty: isEmpty$1,
  isFunction: isFunction$1,
  isNil,
  isNumber: isNumber$1,
  isObject: isObject$1,
  isString,
  isUndefined: isUndefined$2,
  tail,
  toArray,
  reject,
  includes,
  last,
  isPlainObject: isPlainObject$2,
} = lodash;

const { lockMode, waitMode } = constants$1;

// Typically called from `knex.builder`,
// start a new query building chain.
function Builder(client) {
  this.client = client;
  this.and = this;
  this._single = {};
  this._statements = [];
  this._method = 'select';
  if (client.config) {
    saveAsyncStack(this, 5);
    this._debug = client.config.debug;
  }
  // Internal flags used in the builder.
  this._joinFlag = 'inner';
  this._boolFlag = 'and';
  this._notFlag = false;
  this._asColumnFlag = false;
}

inherits(Builder, EventEmitter$1);

const validateWithArgs = function(alias, statement, method) {
  if (typeof alias !== 'string') {
    throw new Error(`${method}() first argument must be a string`);
  }
  if (
    typeof statement === 'function' ||
    statement instanceof Builder ||
    statement instanceof raw
  ) {
    return;
  }
  throw new Error(
    `${method}() second argument must be a function / QueryBuilder or a raw`
  );
};

assign$1(Builder.prototype, {
  toString() {
    return this.toQuery();
  },

  // Convert the current query "toSQL"
  toSQL(method, tz) {
    return this.client.queryCompiler(this).toSQL(method || this._method, tz);
  },

  // Create a shallow clone of the current query builder.
  clone() {
    const cloned = new this.constructor(this.client);
    cloned._method = this._method;
    cloned._single = clone$1(this._single);
    cloned._statements = clone$1(this._statements);
    cloned._debug = this._debug;

    // `_option` is assigned by the `Interface` mixin.
    if (!isUndefined$2(this._options)) {
      cloned._options = clone$1(this._options);
    }
    if (!isUndefined$2(this._queryContext)) {
      cloned._queryContext = clone$1(this._queryContext);
    }
    if (!isUndefined$2(this._connection)) {
      cloned._connection = this._connection;
    }

    return cloned;
  },

  timeout(ms, { cancel } = {}) {
    if (isNumber$1(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  },

  // With
  // ------

  with(alias, statement) {
    validateWithArgs(alias, statement, 'with');
    return this.withWrapped(alias, statement);
  },

  // Helper for compiling any advanced `with` queries.
  withWrapped(alias, query) {
    this._statements.push({
      grouping: 'with',
      type: 'withWrapped',
      alias: alias,
      value: query,
    });
    return this;
  },

  // With Recursive
  // ------

  withRecursive(alias, statement) {
    validateWithArgs(alias, statement, 'withRecursive');
    return this.withRecursiveWrapped(alias, statement);
  },

  // Helper for compiling any advanced `withRecursive` queries.
  withRecursiveWrapped(alias, query) {
    this.withWrapped(alias, query);
    this._statements[this._statements.length - 1].recursive = true;
    return this;
  },

  // Select
  // ------

  // Adds a column or columns to the list of "columns"
  // being selected on the query.
  columns(column) {
    if (!column && column !== 0) return this;
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Allow for a sub-select to be explicitly aliased as a column,
  // without needing to compile the query in a where.
  as(column) {
    this._single.as = column;
    return this;
  },

  // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
  withSchema(schemaName) {
    this._single.schema = schemaName;
    return this;
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert statements
  // e.g. builder.insert({a: value}).into('tableName')
  // `options`: options object containing keys:
  //   - `only`: whether the query should use SQL's ONLY to not return
  //           inheriting table data. Defaults to false.
  table(tableName, options = {}) {
    this._single.table = tableName;
    this._single.only = options.only === true;
    return this;
  },

  // Adds a `distinct` clause to the query.
  distinct() {
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
      distinct: true,
    });
    return this;
  },

  distinctOn() {
    const value = helpers.normalizeArr.apply(null, arguments);
    if (isEmpty$1(value)) {
      throw new Error('distinctOn requires atleast on argument');
    }
    this._statements.push({
      grouping: 'columns',
      value,
      distinctOn: true,
    });
    return this;
  },

  // Adds a join clause to the query, allowing for advanced joins
  // with an anonymous function as the second argument.
  // function(table, first, operator, second)
  join(table, first) {
    let join;
    const { schema } = this._single;
    const joinType = this._joinType();
    if (typeof first === 'function') {
      join = new joinclause(table, joinType, schema);
      first.call(join, join);
    } else if (joinType === 'raw') {
      join = new joinclause(this.client.raw(table, first), 'raw');
    } else {
      join = new joinclause(
        table,
        joinType,
        table instanceof Builder ? undefined : schema
      );
      if (arguments.length > 1) {
        join.on.apply(join, toArray(arguments).slice(1));
      }
    }
    this._statements.push(join);
    return this;
  },

  // JOIN blocks:
  innerJoin() {
    return this._joinType('inner').join.apply(this, arguments);
  },
  leftJoin() {
    return this._joinType('left').join.apply(this, arguments);
  },
  leftOuterJoin() {
    return this._joinType('left outer').join.apply(this, arguments);
  },
  rightJoin() {
    return this._joinType('right').join.apply(this, arguments);
  },
  rightOuterJoin() {
    return this._joinType('right outer').join.apply(this, arguments);
  },
  outerJoin() {
    return this._joinType('outer').join.apply(this, arguments);
  },
  fullOuterJoin() {
    return this._joinType('full outer').join.apply(this, arguments);
  },
  crossJoin() {
    return this._joinType('cross').join.apply(this, arguments);
  },
  joinRaw() {
    return this._joinType('raw').join.apply(this, arguments);
  },

  // The where function can be used in several ways:
  // The most basic is `where(key, value)`, which expands to
  // where key = value.
  where(column, operator, value) {
    // Support "where true || where false"
    if (column === false || column === true) {
      return this.where(1, '=', column ? 1 : 0);
    }

    // Check if the column is a function, in which case it's
    // a where statement wrapped in parens.
    if (typeof column === 'function') {
      return this.whereWrapped(column);
    }

    // Allow a raw statement to be passed along to the query.
    if (column instanceof raw && arguments.length === 1)
      return this.whereRaw(column);

    // Allows `where({id: 2})` syntax.
    if (isObject$1(column) && !(column instanceof raw))
      return this._objectWhere(column);

    // Enable the where('key', value) syntax, only when there
    // are explicitly two arguments passed, so it's not possible to
    // do where('key', '!=') and have that turn into where key != null
    if (arguments.length === 2) {
      value = operator;
      operator = '=';

      // If the value is null, and it's a two argument query,
      // we assume we're going for a `whereNull`.
      if (value === null) {
        return this.whereNull(column);
      }
    }

    // lower case the operator for comparison purposes
    const checkOperator = `${operator}`.toLowerCase().trim();

    // If there are 3 arguments, check whether 'in' is one of them.
    if (arguments.length === 3) {
      if (checkOperator === 'in' || checkOperator === 'not in') {
        return this._not(checkOperator === 'not in').whereIn(
          arguments[0],
          arguments[2]
        );
      }
      if (checkOperator === 'between' || checkOperator === 'not between') {
        return this._not(checkOperator === 'not between').whereBetween(
          arguments[0],
          arguments[2]
        );
      }
    }

    // If the value is still null, check whether they're meaning
    // where value is null
    if (value === null) {
      // Check for .where(key, 'is', null) or .where(key, 'is not', 'null');
      if (checkOperator === 'is' || checkOperator === 'is not') {
        return this._not(checkOperator === 'is not').whereNull(column);
      }
    }

    // Push onto the where statement stack.
    this._statements.push({
      grouping: 'where',
      type: 'whereBasic',
      column,
      operator,
      value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    });
    return this;
  },

  whereColumn(column, operator, rightColumn) {
    this._asColumnFlag = true;
    this.where.apply(this, arguments);
    this._asColumnFlag = false;
    return this;
  },

  // Adds an `or where` clause to the query.
  orWhere() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.whereWrapped(function() {
        for (const key in obj) {
          this.andWhere(key, obj[key]);
        }
      });
    }
    return this.where.apply(this, arguments);
  },

  orWhereColumn() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.whereWrapped(function() {
        for (const key in obj) {
          this.andWhereColumn(key, '=', obj[key]);
        }
      });
    }
    return this.whereColumn.apply(this, arguments);
  },

  // Adds an `not where` clause to the query.
  whereNot() {
    return this._not(true).where.apply(this, arguments);
  },

  whereNotColumn() {
    return this._not(true).whereColumn.apply(this, arguments);
  },

  // Adds an `or not where` clause to the query.
  orWhereNot() {
    return this._bool('or').whereNot.apply(this, arguments);
  },

  orWhereNotColumn() {
    return this._bool('or').whereNotColumn.apply(this, arguments);
  },

  // Processes an object literal provided in a "where" clause.
  _objectWhere(obj) {
    const boolVal = this._bool();
    const notVal = this._not() ? 'Not' : '';
    for (const key in obj) {
      this[boolVal + 'Where' + notVal](key, obj[key]);
    }
    return this;
  },

  // Adds a raw `where` clause to the query.
  whereRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'where',
      type: 'whereRaw',
      value: raw$1,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orWhereRaw(sql, bindings) {
    return this._bool('or').whereRaw(sql, bindings);
  },

  // Helper for compiling any advanced `where` queries.
  whereWrapped(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereWrapped',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where exists` clause to the query.
  whereExists(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds an `or where exists` clause to the query.
  orWhereExists(callback) {
    return this._bool('or').whereExists(callback);
  },

  // Adds a `where not exists` clause to the query.
  whereNotExists(callback) {
    return this._not(true).whereExists(callback);
  },

  // Adds a `or where not exists` clause to the query.
  orWhereNotExists(callback) {
    return this._bool('or').whereNotExists(callback);
  },

  // Adds a `where in` clause to the query.
  whereIn(column, values) {
    if (Array.isArray(values) && isEmpty$1(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'where',
      type: 'whereIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orWhereIn(column, values) {
    return this._bool('or').whereIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  whereNotIn(column, values) {
    return this._not(true).whereIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orWhereNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .whereIn(column, values);
  },

  // Adds a `where null` clause to the query.
  whereNull(column) {
    this._statements.push({
      grouping: 'where',
      type: 'whereNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where null` clause to the query.
  orWhereNull(column) {
    return this._bool('or').whereNull(column);
  },

  // Adds a `where not null` clause to the query.
  whereNotNull(column) {
    return this._not(true).whereNull(column);
  },

  // Adds a `or where not null` clause to the query.
  orWhereNotNull(column) {
    return this._bool('or').whereNotNull(column);
  },

  // Adds a `where between` clause to the query.
  whereBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to whereBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the whereBetween clause'
    );
    this._statements.push({
      grouping: 'where',
      type: 'whereBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where not between` clause to the query.
  whereNotBetween(column, values) {
    return this._not(true).whereBetween(column, values);
  },

  // Adds a `or where between` clause to the query.
  orWhereBetween(column, values) {
    return this._bool('or').whereBetween(column, values);
  },

  // Adds a `or where not between` clause to the query.
  orWhereNotBetween(column, values) {
    return this._bool('or').whereNotBetween(column, values);
  },

  // Adds a `group by` clause to the query.
  groupBy(item) {
    if (item instanceof raw) {
      return this.groupByRaw.apply(this, arguments);
    }
    this._statements.push({
      grouping: 'group',
      type: 'groupByBasic',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Adds a raw `group by` clause to the query.
  groupByRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'group',
      type: 'groupByRaw',
      value: raw$1,
    });
    return this;
  },

  // Adds a `order by` clause to the query.
  orderBy(column, direction) {
    if (Array.isArray(column)) {
      return this._orderByArray(column);
    }
    this._statements.push({
      grouping: 'order',
      type: 'orderByBasic',
      value: column,
      direction,
    });
    return this;
  },

  // Adds a `order by` with multiple columns to the query.
  _orderByArray(columnDefs) {
    for (let i = 0; i < columnDefs.length; i++) {
      const columnInfo = columnDefs[i];
      if (isObject$1(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo['column'],
          direction: columnInfo['order'],
        });
      } else if (isString(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo,
        });
      }
    }
    return this;
  },

  // Add a raw `order by` clause to the query.
  orderByRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'order',
      type: 'orderByRaw',
      value: raw$1,
    });
    return this;
  },

  _union(clause, args) {
    let callbacks = args[0];
    let wrap = args[1];
    if (args.length === 1 || (args.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: clause,
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(args).slice(0, args.length - 1);
      wrap = args[args.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this._union(clause, [callbacks, wrap]);
    }
    return this;
  },

  // Add a union statement to the query.
  union(...args) {
    return this._union('union', args);
  },

  // Adds a union all statement to the query.
  unionAll(...args) {
    return this._union('union all', args);
  },

  // Adds an intersect statement to the query
  intersect(callbacks, wrap) {
    if (arguments.length === 1 || (arguments.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: 'intersect',
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(arguments).slice(0, arguments.length - 1);
      wrap = arguments[arguments.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this.intersect(callbacks, wrap);
    }
    return this;
  },

  // Adds a `having` clause to the query.
  having(column, operator, value) {
    if (column instanceof raw && arguments.length === 1) {
      return this.havingRaw(column);
    }

    // Check if the column is a function, in which case it's
    // a having statement wrapped in parens.
    if (typeof column === 'function') {
      return this.havingWrapped(column);
    }

    this._statements.push({
      grouping: 'having',
      type: 'havingBasic',
      column,
      operator,
      value,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHaving: function orHaving() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject$1(obj) && !isFunction$1(obj) && !(obj instanceof raw)) {
      return this.havingWrapped(function() {
        for (const key in obj) {
          this.andHaving(key, obj[key]);
        }
      });
    }
    return this.having.apply(this, arguments);
  },

  // Helper for compiling any advanced `having` queries.
  havingWrapped(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingWrapped',
      value: callback,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  havingNull(column) {
    this._statements.push({
      grouping: 'having',
      type: 'havingNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingNull(callback) {
    return this._bool('or').havingNull(callback);
  },

  havingNotNull(callback) {
    return this._not(true).havingNull(callback);
  },

  orHavingNotNull(callback) {
    return this._not(true)
      ._bool('or')
      .havingNull(callback);
  },

  havingExists(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingExists(callback) {
    return this._bool('or').havingExists(callback);
  },

  havingNotExists(callback) {
    return this._not(true).havingExists(callback);
  },

  orHavingNotExists(callback) {
    return this._not(true)
      ._bool('or')
      .havingExists(callback);
  },

  havingBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to havingBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the havingBetween clause'
    );
    this._statements.push({
      grouping: 'having',
      type: 'havingBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingBetween(column, values) {
    return this._bool('or').havingBetween(column, values);
  },

  havingNotBetween(column, values) {
    return this._not(true).havingBetween(column, values);
  },

  orHavingNotBetween(column, values) {
    return this._not(true)
      ._bool('or')
      .havingBetween(column, values);
  },

  havingIn(column, values) {
    if (Array.isArray(values) && isEmpty$1(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'having',
      type: 'havingIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orHavingIn(column, values) {
    return this._bool('or').havingIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  havingNotIn(column, values) {
    return this._not(true).havingIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orHavingNotIn(column, values) {
    return this._bool('or')
      ._not(true)
      .havingIn(column, values);
  },

  // Adds a raw `having` clause to the query.
  havingRaw(sql, bindings) {
    const raw$1 = sql instanceof raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'having',
      type: 'havingRaw',
      value: raw$1,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHavingRaw(sql, bindings) {
    return this._bool('or').havingRaw(sql, bindings);
  },

  // Only allow a single "offset" to be set for the current query.
  offset(value) {
    if (isNil(value) || value instanceof raw || value instanceof Builder) {
      // Builder for backward compatibility
      this._single.offset = value;
    } else {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        this.client.logger.warn('A valid integer must be provided to offset');
      } else {
        this._single.offset = val;
      }
    }
    return this;
  },

  // Only allow a single "limit" to be set for the current query.
  limit(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.client.logger.warn('A valid integer must be provided to limit');
    } else {
      this._single.limit = val;
    }
    return this;
  },

  // Retrieve the "count" result of the query.
  count(column, options) {
    return this._aggregate('count', column || '*', options);
  },

  // Retrieve the minimum value of a given column.
  min(column, options) {
    return this._aggregate('min', column, options);
  },

  // Retrieve the maximum value of a given column.
  max(column, options) {
    return this._aggregate('max', column, options);
  },

  // Retrieve the sum of the values of a given column.
  sum(column, options) {
    return this._aggregate('sum', column, options);
  },

  // Retrieve the average of the values of a given column.
  avg(column, options) {
    return this._aggregate('avg', column, options);
  },

  // Retrieve the "count" of the distinct results of the query.
  countDistinct() {
    let columns = helpers.normalizeArr.apply(null, arguments);
    let options;
    if (columns.length > 1 && isPlainObject$2(last(columns))) {
      [options] = columns.splice(columns.length - 1, 1);
    }

    if (!columns.length) {
      columns = '*';
    } else if (columns.length === 1) {
      columns = columns[0];
    }

    return this._aggregate('count', columns, { ...options, distinct: true });
  },

  // Retrieve the sum of the distinct values of a given column.
  sumDistinct(column, options) {
    return this._aggregate('sum', column, { ...options, distinct: true });
  },

  // Retrieve the vg of the distinct results of the query.
  avgDistinct(column, options) {
    return this._aggregate('avg', column, { ...options, distinct: true });
  },

  // Increments a column's value by the specified amount.
  increment(column, amount = 1) {
    if (isObject$1(column)) {
      for (const key in column) {
        this._counter(key, column[key]);
      }

      return this;
    }

    return this._counter(column, amount);
  },

  // Decrements a column's value by the specified amount.
  decrement(column, amount = 1) {
    if (isObject$1(column)) {
      for (const key in column) {
        this._counter(key, -column[key]);
      }

      return this;
    }

    return this._counter(column, -amount);
  },

  // Clears increments/decrements
  clearCounters() {
    this._single.counter = {};

    return this;
  },

  // Sets the values for a `select` query, informing that only the first
  // row should be returned (limit 1).
  first() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .first() on "${this._method}" query!`);
    }

    const args = new Array(arguments.length);
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    this.select.apply(this, args);
    this._method = 'first';
    this.limit(1);
    return this;
  },

  // Use existing connection to execute the query
  // Same value that client.acquireConnection() for an according client returns should be passed
  connection(_connection) {
    this._connection = _connection;
    return this;
  },

  // Pluck a column from a query.
  pluck(column) {
    this._method = 'pluck';
    this._single.pluck = column;
    this._statements.push({
      grouping: 'columns',
      type: 'pluck',
      value: column,
    });
    return this;
  },

  // Remove everything from select clause
  clearSelect() {
    this._clearGrouping('columns');
    return this;
  },

  // Remove everything from where clause
  clearWhere() {
    this._clearGrouping('where');
    return this;
  },

  // Remove everything from group clause
  clearGroup() {
    this._clearGrouping('group');
    return this;
  },

  // Remove everything from order clause
  clearOrder() {
    this._clearGrouping('order');
    return this;
  },

  // Remove everything from having clause
  clearHaving() {
    this._clearGrouping('having');
    return this;
  },

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    this._method = 'insert';
    if (!isEmpty$1(returning)) this.returning(returning);
    this._single.insert = values;
    return this;
  },

  // Sets the values for an `update`, allowing for both
  // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
  update(values, returning) {
    let ret;
    const obj = this._single.update || {};
    this._method = 'update';
    if (isString(values)) {
      obj[values] = returning;
      if (arguments.length > 2) {
        ret = arguments[2];
      }
    } else {
      const keys = Object.keys(values);
      if (this._single.update) {
        this.client.logger.warn('Update called multiple times with objects.');
      }
      let i = -1;
      while (++i < keys.length) {
        obj[keys[i]] = values[keys[i]];
      }
      ret = arguments[1];
    }
    if (!isEmpty$1(ret)) this.returning(ret);
    this._single.update = obj;
    return this;
  },

  // Sets the returning value for the query.
  returning(returning) {
    this._single.returning = returning;
    return this;
  },

  // Delete
  // ------

  // Executes a delete statement on the query;
  delete(ret) {
    this._method = 'del';
    if (!isEmpty$1(ret)) this.returning(ret);
    return this;
  },

  // Truncates a table, ends the query chain.
  truncate(tableName) {
    this._method = 'truncate';
    if (tableName) {
      this._single.table = tableName;
    }
    return this;
  },

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    this._method = 'columnInfo';
    this._single.columnInfo = column;
    return this;
  },

  // Set a lock for update constraint.
  forUpdate() {
    this._single.lock = lockMode.forUpdate;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Set a lock for share constraint.
  forShare() {
    this._single.lock = lockMode.forShare;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Skips locked rows when using a lock constraint.
  skipLocked() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.skipLocked() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.noWait) {
      throw new Error('.skipLocked() cannot be used together with .noWait()!');
    }
    this._single.waitMode = waitMode.skipLocked;
    return this;
  },

  // Causes error when acessing a locked row instead of waiting for it to be released.
  noWait() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.noWait() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.skipLocked) {
      throw new Error('.noWait() cannot be used together with .skipLocked()!');
    }
    this._single.waitMode = waitMode.noWait;
    return this;
  },

  // Takes a JS object of methods to call and calls them
  fromJS(obj) {
    each(obj, (val, key) => {
      if (typeof this[key] !== 'function') {
        this.client.logger.warn(`Knex Error: unknown key ${key}`);
      }
      if (Array.isArray(val)) {
        this[key].apply(this, val);
      } else {
        this[key](val);
      }
    });
    return this;
  },

  // Passes query to provided callback function, useful for e.g. composing
  // domain-specific helpers
  modify(callback) {
    callback.apply(this, [this].concat(tail(arguments)));
    return this;
  },

  // ----------------------------------------------------------------------

  // Helper for the incrementing/decrementing queries.
  _counter(column, amount) {
    amount = parseFloat(amount);

    this._method = 'update';

    this._single.counter = this._single.counter || {};

    this._single.counter[column] = amount;

    return this;
  },

  // Helper to get or set the "boolFlag" value.
  _bool(val) {
    if (arguments.length === 1) {
      this._boolFlag = val;
      return this;
    }
    const ret = this._boolFlag;
    this._boolFlag = 'and';
    return ret;
  },

  // Helper to get or set the "notFlag" value.
  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },

  // Helper to get or set the "joinFlag" value.
  _joinType(val) {
    if (arguments.length === 1) {
      this._joinFlag = val;
      return this;
    }
    const ret = this._joinFlag || 'inner';
    this._joinFlag = 'inner';
    return ret;
  },

  // Helper for compiling any aggregate queries.
  _aggregate(method, column, options = {}) {
    this._statements.push({
      grouping: 'columns',
      type: column instanceof raw ? 'aggregateRaw' : 'aggregate',
      method,
      value: column,
      aggregateDistinct: options.distinct || false,
      alias: options.as,
    });
    return this;
  },

  // Helper function for clearing or reseting a grouping type from the builder
  _clearGrouping(grouping) {
    this._statements = reject(this._statements, { grouping });
  },

  // Helper function that checks if the builder will emit a select query
  _isSelectQuery() {
    return includes(['pluck', 'first', 'select'], this._method);
  },

  // Helper function that checks if the query has a lock mode set
  _hasLockMode() {
    return includes([lockMode.forShare, lockMode.forUpdate], this._single.lock);
  },
});

Object.defineProperty(Builder.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

Object.defineProperty(Builder.prototype, 'not', {
  get() {
    return this._not(true);
  },
});

Builder.prototype.select = Builder.prototype.columns;
Builder.prototype.column = Builder.prototype.columns;
Builder.prototype.andWhereNot = Builder.prototype.whereNot;
Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
Builder.prototype.andWhere = Builder.prototype.where;
Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
Builder.prototype.andHaving = Builder.prototype.having;
Builder.prototype.andHavingIn = Builder.prototype.havingIn;
Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
Builder.prototype.andHavingNull = Builder.prototype.havingNull;
Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
Builder.prototype.andHavingExists = Builder.prototype.havingExists;
Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
Builder.prototype.from = Builder.prototype.table;
Builder.prototype.into = Builder.prototype.table;
Builder.prototype.del = Builder.prototype.delete;

// Attach all of the top level promise methods that should be chainable.
_interface(Builder);
helpers.addQueryContext(Builder);

Builder.extend = (methodName, fn) => {
  if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
    throw new Error(
      `Can't extend QueryBuilder with existing method ('${methodName}').`
    );
  }

  assign$1(Builder.prototype, { [methodName]: fn });
};

var builder = Builder;

const { transform } = lodash;

// Valid values for the `order by` clause generation.
const orderBys = ['asc', 'desc'];

// Turn this into a lookup map
const operators = transform(
  [
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!=',
    'like',
    'not like',
    'between',
    'not between',
    'ilike',
    'not ilike',
    'exists',
    'not exist',
    'rlike',
    'not rlike',
    'regexp',
    'not regexp',
    '&',
    '|',
    '^',
    '<<',
    '>>',
    '~',
    '~*',
    '!~',
    '!~*',
    '#',
    '&&',
    '@>',
    '<@',
    '||',
    '&<',
    '&>',
    '-|-',
    '@@',
    '!!',
    ['?', '\\?'],
    ['?|', '\\?|'],
    ['?&', '\\?&'],
  ],
  (result, key) => {
    if (Array.isArray(key)) {
      result[key[0]] = key[1];
    } else {
      result[key] = key;
    }
  },
  {}
);

class Formatter {
  constructor(client, builder) {
    this.client = client;
    this.builder = builder;
    this.bindings = [];
  }

  // Accepts a string or array of columns to wrap as appropriate.
  columnize(target) {
    const columns = Array.isArray(target) ? target : [target];
    let str = '',
      i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', ';
      str += this.wrap(columns[i]);
    }
    return str;
  }

  // Turns a list of values into a list of ?'s, joining them with commas unless
  // a "joining" value is specified (e.g. ' and ')
  parameterize(values, notSetValue) {
    if (typeof values === 'function') return this.parameter(values);
    values = Array.isArray(values) ? values : [values];
    let str = '',
      i = -1;
    while (++i < values.length) {
      if (i > 0) str += ', ';
      str += this.parameter(values[i] === undefined ? notSetValue : values[i]);
    }
    return str;
  }

  // Formats `values` into a parenthesized list of parameters for a `VALUES`
  // clause.
  //
  // [1, 2]                  -> '(?, ?)'
  // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
  // knex('table')           -> '(select * from "table")'
  // knex.raw('select ?', 1) -> '(select ?)'
  //
  values(values) {
    if (Array.isArray(values)) {
      if (Array.isArray(values[0])) {
        return `(${values
          .map((value) => `(${this.parameterize(value)})`)
          .join(', ')})`;
      }
      return `(${this.parameterize(values)})`;
    }

    if (values instanceof raw) {
      return `(${this.parameter(values)})`;
    }

    return this.parameter(values);
  }

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  parameter(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    }
    return this.unwrapRaw(value, true) || '?';
  }

  unwrapRaw(value, isParameter) {
    let query;
    if (value instanceof builder) {
      query = this.client.queryCompiler(value).toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return this.outputQuery(query, isParameter);
    }
    if (value instanceof raw) {
      value.client = this.client;
      if (this.builder._queryContext) {
        value.queryContext = () => {
          return this.builder._queryContext;
        };
      }

      query = value.toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return query.sql;
    }
    if (isParameter) {
      this.bindings.push(value);
    }
  }

  /**
   * Creates SQL for a parameter, which might be passed to where() or .with() or
   * pretty much anywhere in API.
   *
   * @param query Callback (for where or complete builder), Raw or QueryBuilder
   * @param method Optional at least 'select' or 'update' are valid
   */
  rawOrFn(value, method) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value, method));
    }
    return this.unwrapRaw(value) || '';
  }

  // Puts the appropriate wrapper around a value depending on the database
  // engine, unless it's a knex.raw value, in which case it's left alone.
  wrap(value, isParameter) {
    const raw = this.unwrapRaw(value, isParameter);
    if (raw) return raw;
    switch (typeof value) {
      case 'function':
        return this.outputQuery(this.compileCallback(value), true);
      case 'object':
        return this.parseObject(value);
      case 'number':
        return value;
      default:
        return this.wrapString(value + '');
    }
  }

  wrapAsIdentifier(value) {
    const queryContext = this.builder.queryContext();
    return this.client.wrapIdentifier((value || '').trim(), queryContext);
  }

  alias(first, second) {
    return first + ' as ' + second;
  }

  operator(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    const operator = operators[(value || '').toLowerCase()];
    if (!operator) {
      throw new TypeError(`The operator "${value}" is not permitted`);
    }
    return operator;
  }

  // Specify the direction of the ordering.
  direction(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    return orderBys.indexOf((value || '').toLowerCase()) !== -1 ? value : 'asc';
  }

  // Compiles a callback using the query builder.
  compileCallback(callback, method) {
    const { client } = this;

    // Build the callback
    const builder = client.queryBuilder();
    callback.call(builder, builder);

    // Compile the callback, using the current formatter (to track all bindings).
    const compiler = client.queryCompiler(builder);
    compiler.formatter = this;

    // Return the compiled & parameterized sql.
    return compiler.toSQL(method || builder._method || 'select');
  }

  // Ensures the query is aliased if necessary.
  outputQuery(compiled, isParameter) {
    let sql = compiled.sql || '';
    if (sql) {
      if (
        (compiled.method === 'select' || compiled.method === 'first') &&
        (isParameter || compiled.as)
      ) {
        sql = `(${sql})`;
        if (compiled.as) return this.alias(sql, this.wrap(compiled.as));
      }
    }
    return sql;
  }

  // Key-value notation for alias
  parseObject(obj) {
    const ret = [];
    for (const alias in obj) {
      const queryOrIdentifier = obj[alias];
      // Avoids double aliasing for subqueries
      if (typeof queryOrIdentifier === 'function') {
        const compiled = this.compileCallback(queryOrIdentifier);
        compiled.as = alias; // enforces the object's alias
        ret.push(this.outputQuery(compiled, true));
      } else if (queryOrIdentifier instanceof builder) {
        ret.push(
          this.alias(
            `(${this.wrap(queryOrIdentifier)})`,
            this.wrapAsIdentifier(alias)
          )
        );
      } else {
        ret.push(
          this.alias(this.wrap(queryOrIdentifier), this.wrapAsIdentifier(alias))
        );
      }
    }
    return ret.join(', ');
  }

  // Coerce to string to prevent strange errors when it's not a string.
  wrapString(value) {
    const asIndex = value.toLowerCase().indexOf(' as ');
    if (asIndex !== -1) {
      const first = value.slice(0, asIndex);
      const second = value.slice(asIndex + 4);
      return this.alias(this.wrap(first), this.wrapAsIdentifier(second));
    }
    const wrapped = [];
    let i = -1;
    const segments = value.split('.');
    while (++i < segments.length) {
      value = segments[i];
      if (i === 0 && segments.length > 1) {
        wrapped.push(this.wrap((value || '').trim()));
      } else {
        wrapped.push(this.wrapAsIdentifier(value));
      }
    }
    return wrapped.join('.');
  }
}

var formatter = Formatter;

//Get schema-aware table name
function getTableName(tableName, schemaName) {
  return schemaName ? `${schemaName}.${tableName}` : tableName;
}

//Get schema-aware query builder for a given table and schema name
function getTable(trxOrKnex, tableName, schemaName) {
  return schemaName
    ? trxOrKnex(tableName).withSchema(schemaName)
    : trxOrKnex(tableName);
}
function getLockTableName(tableName) {
  return tableName + '_lock';
}

function getLockTableNameWithSchema(tableName, schemaName) {
  return schemaName
    ? schemaName + '.' + getLockTableName(tableName)
    : getLockTableName(tableName);
}

var tableResolver = {
  getLockTableName,
  getLockTableNameWithSchema,
  getTable,
  getTableName,
};

const {
  getTable: getTable$1,
  getLockTableName: getLockTableName$1,
  getLockTableNameWithSchema: getLockTableNameWithSchema$1,
  getTableName: getTableName$1,
} = tableResolver;

function ensureTable(tableName, schemaName, trxOrKnex) {
  const lockTable = getLockTableName$1(tableName);
  const lockTableWithSchema = getLockTableNameWithSchema$1(
    tableName,
    schemaName
  );
  return getSchemaBuilder(trxOrKnex, schemaName)
    .hasTable(tableName)
    .then((exists) => {
      return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
    })
    .then(() => {
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
    })
    .then((exists) => {
      return (
        !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex)
      );
    })
    .then(() => {
      return getTable$1(trxOrKnex, lockTable, schemaName).select('*');
    })
    .then((data) => {
      return (
        !data.length &&
        trxOrKnex.into(lockTableWithSchema).insert({ is_locked: 0 })
      );
    });
}

function _createMigrationTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    getTableName$1(tableName),
    function(t) {
      t.increments();
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    }
  );
}

function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    tableName,
    function(t) {
      t.increments('index').primary();
      t.integer('is_locked');
    }
  );
}

//Get schema-aware schema builder for a given schema nam
function getSchemaBuilder(trxOrKnex, schemaName) {
  return schemaName
    ? trxOrKnex.schema.withSchema(schemaName)
    : trxOrKnex.schema;
}

var tableCreator = {
  ensureTable,
  getSchemaBuilder,
};

const { getTableName: getTableName$2 } = tableResolver;
const { ensureTable: ensureTable$1 } = tableCreator;

// Lists all available migration versions, as a sorted array.
function listAll(migrationSource, loadExtensions) {
  return migrationSource.getMigrations(loadExtensions);
}

// Lists all migrations that have been completed for the current db, as an
// array.
function listCompleted(tableName, schemaName, trxOrKnex) {
  return ensureTable$1(tableName, schemaName, trxOrKnex)
    .then(() =>
      trxOrKnex
        .from(getTableName$2(tableName, schemaName))
        .orderBy('id')
        .select('name')
    )
    .then((migrations) =>
      migrations.map((migration) => {
        return migration.name;
      })
    );
}

// Gets the migration list from the migration directory specified in config, as well as
// the list of completed migrations to check what should be run.
function listAllAndCompleted(config, trxOrKnex) {
  return Promise.all([
    listAll(config.migrationSource, config.loadExtensions),
    listCompleted(config.tableName, config.schemaName, trxOrKnex),
  ]);
}

var migrationListResolver = {
  listAll,
  listAllAndCompleted,
  listCompleted,
};

const { promisify } = util;

// Promisify common fs functions.
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

/**
 * Creates a temporary directory and returns it path.
 *
 * @returns {Promise<string>}
 */
function createTemp() {
  return promisify(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);
}

/**
 * Ensures the given path exists.
 *  - If the path already exist, it's fine - it does nothing.
 *  - If the path doesn't exist, it will create it.
 *
 * @param {string} path
 * @returns {Promise}
 */
function ensureDirectoryExists(dir) {
  return stat(dir).catch(() => mkdirp(dir));
}

var fs_1 = {
  stat,
  readdir,
  readFile,
  writeFile,
  createTemp,
  ensureDirectoryExists,
};

const { template } = lodash;

const { readFile: readFile$1, writeFile: writeFile$1 } = fs_1;

/**
 * Light wrapper over lodash templates making it safer to be used with javascript source code.
 *
 * In particular, doesn't interfere with use of interpolated strings in javascript.
 *
 * @param {string} content Template source
 * @param {_.TemplateOptions} options Template options
 */
const jsSourceTemplate = (content, options) =>
  template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options,
  });

/**
 * Compile the contents of specified (javascript) file as a lodash template
 *
 * @param {string} filePath Path of file to be used as template
 * @param {_.TemplateOptions} options Lodash template options
 */
const jsFileTemplate = async (filePath, options) => {
  const contentBuffer = await readFile$1(filePath);
  return jsSourceTemplate(contentBuffer.toString(), options);
};

/**
 * Write a javascript file using another file as a (lodash) template
 *
 * @param {string} targetFilePath
 * @param {string} sourceFilePath
 * @param {_.TemplateOptions} options options passed to lodash templates
 */
const writeJsFileUsingTemplate = async (
  targetFilePath,
  sourceFilePath,
  options,
  variables
) =>
  writeFile$1(
    targetFilePath,
    (await jsFileTemplate(sourceFilePath, options))(variables)
  );

var template_1 = {
  jsSourceTemplate,
  jsFileTemplate,
  writeJsFileUsingTemplate,
};

const { sortBy, filter } = lodash;

const { readdir: readdir$1 } = fs_1;

const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
  '.co',
  '.coffee',
  '.eg',
  '.iced',
  '.js',
  '.litcoffee',
  '.ls',
  '.ts',
]);

class FsMigrations {
  constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  getMigrations(loadExtensions) {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      return readdir$1(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }

        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );

        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          this,
          migrations,
          loadExtensions || this.loadExtensions
        );
      }

      return filterMigrations(
        this,
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration) {
    return migration.file;
  }

  getMigration(migration) {
    const absoluteDir = path.resolve(process.cwd(), migration.directory);
    return commonjsRequire(path.join(absoluteDir, migration.file));
  }
}

function filterMigrations(migrationSource, migrations, loadExtensions) {
  return filter(migrations, (migration) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}

var fsMigrations = {
  DEFAULT_LOAD_EXTENSIONS,
  FsMigrations,
};

const {
  FsMigrations: FsMigrations$1,
  DEFAULT_LOAD_EXTENSIONS: DEFAULT_LOAD_EXTENSIONS$1,
} = fsMigrations;

const CONFIG_DEFAULT = Object.freeze({
  extension: 'js',
  loadExtensions: DEFAULT_LOAD_EXTENSIONS$1,
  tableName: 'knex_migrations',
  schemaName: null,
  directory: './migrations',
  disableTransactions: false,
  disableMigrationsListValidation: false,
  sortDirsSeparately: false,
});

function getMergedConfig(config, currentConfig) {
  // config is the user specified config, mergedConfig has defaults and current config
  // applied to it.
  const mergedConfig = Object.assign(
    {},
    CONFIG_DEFAULT,
    currentConfig || {},
    config
  );

  if (
    config &&
    // If user specifies any FS related config,
    // clear existing FsMigrations migrationSource
    (config.directory ||
      config.sortDirsSeparately !== undefined ||
      config.loadExtensions)
  ) {
    mergedConfig.migrationSource = null;
  }

  // If the user has not specified any configs, we need to
  // default to fs migrations to maintain compatibility
  if (!mergedConfig.migrationSource) {
    mergedConfig.migrationSource = new FsMigrations$1(
      mergedConfig.directory,
      mergedConfig.sortDirsSeparately,
      mergedConfig.loadExtensions
    );
  }

  return mergedConfig;
}

var configurationMerger = {
  getMergedConfig,
};

const { writeJsFileUsingTemplate: writeJsFileUsingTemplate$1 } = template_1;
const { getMergedConfig: getMergedConfig$1 } = configurationMerger;
const { ensureDirectoryExists: ensureDirectoryExists$1 } = fs_1;

class MigrationGenerator {
  constructor(migrationConfig) {
    this.config = getMergedConfig$1(migrationConfig);
  }

  // Creates a new migration, with a given name.
  async make(name, config) {
    this.config = getMergedConfig$1(config, this.config);
    if (!name) {
      return Promise.reject(
        new Error('A name must be specified for the generated migration')
      );
    }
    await this._ensureFolder();
    const createdMigrationFilePath = await this._writeNewMigration(name);
    return createdMigrationFilePath;
  }

  // Ensures a folder for the migrations exist, dependent on the migration
  // config settings.
  _ensureFolder() {
    const dirs = this._absoluteConfigDirs();

    const promises = dirs.map(ensureDirectoryExists$1);

    return Promise.all(promises);
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewMigrationName(name) {
    if (name[0] === '-') name = name.slice(1);
    return yyyymmddhhmmss() + '_' + name + '.' + this.config.extension;
  }

  _getNewMigrationPath(name) {
    const fileName = this._getNewMigrationName(name);
    const dirs = this._absoluteConfigDirs();
    const dir = dirs.slice(-1)[0]; // Get last specified directory
    return path.join(dir, fileName);
  }

  // Write a new migration to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewMigration(name) {
    const migrationPath = this._getNewMigrationPath(name);
    await writeJsFileUsingTemplate$1(
      migrationPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return migrationPath;
  }

  _absoluteConfigDirs() {
    const directories = Array.isArray(this.config.directory)
      ? this.config.directory
      : [this.config.directory];
    return directories.map((directory) => {
      if (!directory) {
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to resolve config file, knex cannot determine where to generate migrations'
        );
      }
      return path.resolve(process.cwd(), directory);
    });
  }
}

// Ensure that we have 2 places for each of the date segments.
function padDate(segment) {
  segment = segment.toString();
  return segment[1] ? segment : `0${segment}`;
}

// Get a date object in the correct format, without requiring a full out library
// like "moment.js".
function yyyymmddhhmmss() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())
  );
}

var MigrationGenerator_1 = MigrationGenerator;

// Migrator
// -------
const {
  differenceWith,
  each: each$1,
  filter: filter$1,
  get,
  isFunction: isFunction$2,
  isBoolean: isBoolean$1,
  isEmpty: isEmpty$2,
  isUndefined: isUndefined$3,
  max,
} = lodash;

const {
  getLockTableName: getLockTableName$2,
  getLockTableNameWithSchema: getLockTableNameWithSchema$2,
  getTable: getTable$2,
  getTableName: getTableName$3,
} = tableResolver;
const { getSchemaBuilder: getSchemaBuilder$1 } = tableCreator;

const { getMergedConfig: getMergedConfig$2 } = configurationMerger;

function LockError(msg) {
  this.name = 'MigrationLocked';
  this.message = msg;
}

inherits(LockError, Error);

// The new migration we're performing, typically called from the `knex.migrate`
// interface on the main `knex` object. Passes the `knex` instance performing
// the migration.
class Migrator {
  constructor(knex) {
    // Clone knex instance and remove post-processing that is unnecessary for internal queries from a cloned config
    if (isFunction$2(knex)) {
      if (!knex.isTransaction) {
        this.knex = knex.withUserParams({
          ...knex.userParams,
        });
      } else {
        this.knex = knex;
      }
    } else {
      this.knex = Object.assign({}, knex);
      this.knex.userParams = this.knex.userParams || {};
    }

    this.config = getMergedConfig$2(this.knex.client.config.migrations);
    this.generator = new MigrationGenerator_1(
      this.knex.client.config.migrations
    );
    this._activeMigration = {
      fileName: null,
    };
  }

  // Migrators to the latest configuration.
  latest(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const migrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );

        const transactionForAll =
          !this.config.disableTransactions &&
          isEmpty$2(
            filter$1(migrations, (migration) => {
              const migrationContents = this.config.migrationSource.getMigration(
                migration
              );
              return !this._useTransaction(migrationContents);
            })
          );

        if (transactionForAll) {
          return this.knex.transaction((trx) => {
            return this._runBatch(migrations, 'up', trx);
          });
        } else {
          return this._runBatch(migrations, 'up');
        }
      });
  }

  // Runs the next migration that has not yet been run
  up(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const newMigrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );

        let migrationToRun;
        const name = this.config.name;
        if (name) {
          if (!completed.includes(name)) {
            migrationToRun = newMigrations.find((migration) => {
              return (
                this.config.migrationSource.getMigrationName(migration) === name
              );
            });
            if (!migrationToRun) {
              throw new Error(`Migration "${name}" not found.`);
            }
          }
        } else {
          migrationToRun = newMigrations[0];
        }

        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }

        const transactionForAll =
          !this.config.disableTransactions &&
          isEmpty$2(
            filter$1(migrationsToRun, (migration) => {
              const migrationContents = this.config.migrationSource.getMigration(
                migration
              );

              return !this._useTransaction(migrationContents);
            })
          );

        if (transactionForAll) {
          return this.knex.transaction((trx) => {
            return this._runBatch(migrationsToRun, 'up', trx);
          });
        } else {
          return this._runBatch(migrationsToRun, 'up');
        }
      });
  }

  // Rollback the last "batch", or all, of migrations that were run.
  rollback(config, all = false) {
    this._disableProcessing();
    return new Promise((resolve, reject) => {
      try {
        this.config = getMergedConfig$2(config, this.config);
      } catch (e) {
        reject(e);
      }
      migrationListResolver
        .listAllAndCompleted(this.config, this.knex)
        .then((value) => {
          if (!this.config.disableMigrationsListValidation) {
            validateMigrationList(this.config.migrationSource, value);
          }
          return value;
        })
        .then((val) => {
          const [allMigrations, completedMigrations] = val;

          return all
            ? allMigrations
                .filter((migration) => {
                  return completedMigrations.includes(migration.file);
                })
                .reverse()
            : this._getLastBatch(val);
        })
        .then((migrations) => {
          return this._runBatch(migrations, 'down');
        })
        .then(resolve, reject);
    });
  }

  down(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listAllAndCompleted(this.config, this.knex)
      .then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      })
      .then(([all, completed]) => {
        const completedMigrations = all.filter((migration) => {
          return completed.includes(
            this.config.migrationSource.getMigrationName(migration)
          );
        });

        let migrationToRun;
        const name = this.config.name;
        if (name) {
          migrationToRun = completedMigrations.find((migration) => {
            return (
              this.config.migrationSource.getMigrationName(migration) === name
            );
          });
          if (!migrationToRun) {
            throw new Error(`Migration "${name}" was not run.`);
          }
        } else {
          migrationToRun = completedMigrations[completedMigrations.length - 1];
        }

        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }

        return this._runBatch(migrationsToRun, 'down');
      });
  }

  status(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return Promise.all([
      getTable$2(
        this.knex,
        this.config.tableName,
        this.config.schemaName
      ).select('*'),
      migrationListResolver.listAll(this.config.migrationSource),
    ]).then(([db, code]) => db.length - code.length);
  }

  // Retrieves and returns the current migration version we're on, as a promise.
  // If no migrations have been run yet, return "none".
  currentVersion(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    return migrationListResolver
      .listCompleted(this.config.tableName, this.config.schemaName, this.knex)
      .then((completed) => {
        const val = max(completed.map((value) => value.split('_')[0]));
        return isUndefined$3(val) ? 'none' : val;
      });
  }

  // list all migrations
  async list(config) {
    this._disableProcessing();
    this.config = getMergedConfig$2(config, this.config);

    const [all, completed] = await migrationListResolver.listAllAndCompleted(
      this.config,
      this.knex
    );

    if (!this.config.disableMigrationsListValidation) {
      validateMigrationList(this.config.migrationSource, [all, completed]);
    }

    const newMigrations = getNewMigrations(
      this.config.migrationSource,
      all,
      completed
    );
    return [completed, newMigrations];
  }

  forceFreeMigrationsLock(config) {
    this.config = getMergedConfig$2(config, this.config);

    const lockTable = getLockTableName$2(this.config.tableName);
    return getSchemaBuilder$1(this.knex, this.config.schemaName)
      .hasTable(lockTable)
      .then((exist) => exist && this._freeLock());
  }

  // Creates a new migration, with a given name.
  make(name, config) {
    this.config = getMergedConfig$2(config, this.config);
    return this.generator.make(name, this.config);
  }

  _disableProcessing() {
    if (this.knex.disableProcessing) {
      this.knex.disableProcessing();
    }
  }

  _lockMigrations(trx) {
    const tableName = getLockTableName$2(this.config.tableName);
    return getTable$2(this.knex, tableName, this.config.schemaName)
      .transacting(trx)
      .where('is_locked', '=', 0)
      .update({ is_locked: 1 })
      .then((rowCount) => {
        if (rowCount != 1) {
          throw new Error('Migration table is already locked');
        }
      });
  }

  _getLock(trx) {
    const transact = trx ? (fn) => fn(trx) : (fn) => this.knex.transaction(fn);
    return transact((trx) => {
      return this._lockMigrations(trx);
    }).catch((err) => {
      throw new LockError(err.message);
    });
  }

  _freeLock(trx = this.knex) {
    const tableName = getLockTableName$2(this.config.tableName);
    return getTable$2(trx, tableName, this.config.schemaName).update({
      is_locked: 0,
    });
  }

  // Run a batch of current migrations, in sequence.
  _runBatch(migrations, direction, trx) {
    return (
      this._getLock(trx)
        // When there is a wrapping transaction, some migrations
        // could have been done while waiting for the lock:
        .then(() =>
          trx
            ? migrationListResolver.listCompleted(
                this.config.tableName,
                this.config.schemaName,
                trx
              )
            : []
        )
        .then(
          (completed) =>
            (migrations = getNewMigrations(
              this.config.migrationSource,
              migrations,
              completed
            ))
        )
        .then(() =>
          Promise.all(
            migrations.map(this._validateMigrationStructure.bind(this))
          )
        )
        .then(() => this._latestBatchNumber(trx))
        .then((batchNo) => {
          if (direction === 'up') batchNo++;
          return batchNo;
        })
        .then((batchNo) => {
          return this._waterfallBatch(batchNo, migrations, direction, trx);
        })
        .then(async (res) => {
          await this._freeLock(trx);
          return res;
        })
        .catch(async (error) => {
          let cleanupReady = Promise.resolve();

          if (error instanceof LockError) {
            // If locking error do not free the lock.
            this.knex.client.logger.warn(
              `Can't take lock to run migrations: ${error.message}`
            );
            this.knex.client.logger.warn(
              'If you are sure migrations are not running you can release the ' +
                'lock manually by deleting all the rows = require(migrations lock ' +
                'table: ' +
                getLockTableNameWithSchema$2(
                  this.config.tableName,
                  this.config.schemaName
                )
            );
          } else {
            if (this._activeMigration.fileName) {
              this.knex.client.logger.warn(
                `migration file "${this._activeMigration.fileName}" failed`
              );
            }
            this.knex.client.logger.warn(
              `migration failed with error: ${error.message}`
            );
            // If the error was not due to a locking issue, then remove the lock.
            cleanupReady = this._freeLock(trx);
          }

          try {
            await cleanupReady;
            // eslint-disable-next-line no-empty
          } catch (e) {}
          throw error;
        })
    );
  }

  // Validates some migrations by requiring and checking for an `up` and `down`
  // function.
  _validateMigrationStructure(migration) {
    const migrationName = this.config.migrationSource.getMigrationName(
      migration
    );
    const migrationContent = this.config.migrationSource.getMigration(
      migration
    );
    if (
      typeof migrationContent.up !== 'function' ||
      typeof migrationContent.down !== 'function'
    ) {
      throw new Error(
        `Invalid migration: ${migrationName} must have both an up and down function`
      );
    }

    return migration;
  }

  // Get the last batch of migrations, by name, ordered by insert id in reverse
  // order.
  _getLastBatch([allMigrations]) {
    const { tableName, schemaName } = this.config;
    return getTable$2(this.knex, tableName, schemaName)
      .where('batch', function(qb) {
        qb.max('batch').from(getTableName$3(tableName, schemaName));
      })
      .orderBy('id', 'desc')
      .then((migrations) =>
        Promise.all(
          migrations.map((migration) => {
            return allMigrations.find((entry) => {
              return (
                this.config.migrationSource.getMigrationName(entry) ===
                migration.name
              );
            });
          })
        )
      );
  }

  // Returns the latest batch number.
  _latestBatchNumber(trx = this.knex) {
    return trx
      .from(getTableName$3(this.config.tableName, this.config.schemaName))
      .max('batch as max_batch')
      .then((obj) => obj[0].max_batch || 0);
  }

  // If transaction config for a single migration is defined, use that.
  // Otherwise, rely on the common config. This allows enabling/disabling
  // transaction for a single migration at will, regardless of the common
  // config.
  _useTransaction(migrationContent, allTransactionsDisabled) {
    const singleTransactionValue = get(migrationContent, 'config.transaction');

    return isBoolean$1(singleTransactionValue)
      ? singleTransactionValue
      : !allTransactionsDisabled;
  }

  // Runs a batch of `migrations` in a specified `direction`, saving the
  // appropriate database information as the migrations are run.
  _waterfallBatch(batchNo, migrations, direction, trx) {
    const trxOrKnex = trx || this.knex;
    const { tableName, schemaName, disableTransactions } = this.config;
    let current = Promise.resolve();
    const log = [];
    each$1(migrations, (migration) => {
      const name = this.config.migrationSource.getMigrationName(migration);
      this._activeMigration.fileName = name;
      const migrationContent = this.config.migrationSource.getMigration(
        migration
      );

      // We're going to run each of the migrations in the current "up".
      current = current
        .then(() => {
          this._activeMigration.fileName = name;
          if (
            !trx &&
            this._useTransaction(migrationContent, disableTransactions)
          ) {
            this.knex.enableProcessing();
            return this._transaction(
              this.knex,
              migrationContent,
              direction,
              name
            );
          }

          trxOrKnex.enableProcessing();
          return checkPromise(
            this.knex.client.logger,
            migrationContent[direction](trxOrKnex),
            name
          );
        })
        .then(() => {
          trxOrKnex.disableProcessing();
          this.knex.disableProcessing();
          log.push(name);
          if (direction === 'up') {
            return trxOrKnex
              .into(getTableName$3(tableName, schemaName))
              .insert({
                name,
                batch: batchNo,
                migration_time: new Date(),
              });
          }
          if (direction === 'down') {
            return trxOrKnex
              .from(getTableName$3(tableName, schemaName))
              .where({ name })
              .del();
          }
        });
    });

    return current.then(() => [batchNo, log]);
  }

  _transaction(knex, migrationContent, direction, name) {
    return knex.transaction((trx) => {
      return checkPromise(
        knex.client.logger,
        migrationContent[direction](trx),
        name,
        () => {
          trx.commit();
        }
      );
    });
  }
}

// Validates that migrations are present in the appropriate directories.
function validateMigrationList(migrationSource, migrations) {
  const all = migrations[0];
  const completed = migrations[1];
  const diff = getMissingMigrations(migrationSource, completed, all);
  if (!isEmpty$2(diff)) {
    throw new Error(
      `The migration directory is corrupt, the following files are missing: ${diff.join(
        ', '
      )}`
    );
  }
}

function getMissingMigrations(migrationSource, completed, all) {
  return differenceWith(completed, all, (completedMigration, allMigration) => {
    return (
      completedMigration === migrationSource.getMigrationName(allMigration)
    );
  });
}

function getNewMigrations(migrationSource, all, completed) {
  return differenceWith(all, completed, (allMigration, completedMigration) => {
    return (
      completedMigration === migrationSource.getMigrationName(allMigration)
    );
  });
}

function checkPromise(logger, migrationPromise, name, commitFn) {
  if (!migrationPromise || typeof migrationPromise.then !== 'function') {
    logger.warn(`migration ${name} did not return a promise`);
    if (commitFn) {
      commitFn();
    }
  }
  return migrationPromise;
}

var Migrator_1 = {
  Migrator,
};

// Seeder
// -------

const { filter: filter$2, includes: includes$1, extend } = lodash;
const {
  readdir: readdir$2,
  ensureDirectoryExists: ensureDirectoryExists$2,
} = fs_1;
const { writeJsFileUsingTemplate: writeJsFileUsingTemplate$2 } = template_1;

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
class Seeder {
  constructor(knex) {
    this.knex = knex;
    this.config = this.setConfig(knex.client.config.seeds);
  }

  // Runs seed files for the given environment.
  async run(config) {
    this.config = this.setConfig(config);
    const all = await this._listAll();
    const files =
      config && config.specific
        ? all.filter((file) => file === config.specific)
        : all;
    return this._runSeeds(files);
  }

  // Creates a new seed file, with a given name.
  async make(name, config) {
    this.config = this.setConfig(config);
    if (!name)
      throw new Error('A name must be specified for the generated seed');
    await this._ensureFolder(config);
    const seedPath = await this._writeNewSeed(name);
    return seedPath;
  }

  // Lists all available seed files as a sorted array.
  async _listAll(config) {
    this.config = this.setConfig(config);
    const loadExtensions = this.config.loadExtensions;
    return readdir$2(this._absoluteConfigDir()).then((seeds) =>
      filter$2(seeds, (value) => {
        const extension = path.extname(value);
        return includes$1(loadExtensions, extension);
      }).sort()
    );
  }

  // Ensures a folder for the seeds exist, dependent on the
  // seed config settings.
  async _ensureFolder() {
    const dir = this._absoluteConfigDir();

    await ensureDirectoryExists$2(dir);
  }

  // Run seed files, in sequence.
  _runSeeds(seeds) {
    seeds.forEach((seed) => this._validateSeedStructure(seed));
    return this._waterfallBatch(seeds);
  }

  // Validates seed files by requiring and checking for a `seed` function.
  _validateSeedStructure(name) {
    const seed = commonjsRequire(path.join(this._absoluteConfigDir(), name));
    if (typeof seed.seed !== 'function') {
      throw new Error(`Invalid seed file: ${name} must have a seed function`);
    }
    return name;
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewStubFileName(name) {
    if (name[0] === '-') name = name.slice(1);
    return name + '.' + this.config.extension;
  }

  _getNewStubFilePath(name) {
    return path.join(this._absoluteConfigDir(), this._getNewStubFileName(name));
  }

  // Write a new seed to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewSeed(name) {
    const seedPath = this._getNewStubFilePath(name);
    await writeJsFileUsingTemplate$2(
      seedPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return seedPath;
  }

  // Runs a batch of seed files.
  async _waterfallBatch(seeds) {
    const { knex } = this;
    const seedDirectory = this._absoluteConfigDir();
    const log = [];
    for (const seedName of seeds) {
      const seedPath = path.join(seedDirectory, seedName);
      const seed = commonjsRequire();
      try {
        await seed.seed(knex);
        log.push(seedPath);
      } catch (originalError) {
        const error = new Error(
          `Error while executing "${seedPath}" seed: ${originalError.message}`
        );
        error.original = originalError;
        error.stack =
          error.stack
            .split('\n')
            .slice(0, 2)
            .join('\n') +
          '\n' +
          originalError.stack;
        throw error;
      }
    }
    return [log];
  }

  _absoluteConfigDir() {
    return path.resolve(process.cwd(), this.config.directory);
  }

  setConfig(config) {
    return extend(
      {
        extension: 'js',
        directory: './seeds',
        loadExtensions: [
          '.co',
          '.coffee',
          '.eg',
          '.iced',
          '.js',
          '.litcoffee',
          '.ls',
          '.ts',
        ],
      },
      this.config || {},
      config
    );
  }
}

var Seeder_1 = Seeder;

// FunctionHelper
// -------
function FunctionHelper(client) {
  this.client = client;
}

FunctionHelper.prototype.now = function(precision) {
  if (typeof precision === 'number') {
    return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
  }
  return this.client.raw('CURRENT_TIMESTAMP');
};

var functionhelper = FunctionHelper;

// All properties we can use to start a query chain
// from the `knex` object, e.g. `knex.select('*').from(...`
var methods = [
  'with',
  'withRecursive',
  'select',
  'as',
  'columns',
  'column',
  'from',
  'fromJS',
  'into',
  'withSchema',
  'table',
  'distinct',
  'join',
  'joinRaw',
  'innerJoin',
  'leftJoin',
  'leftOuterJoin',
  'rightJoin',
  'rightOuterJoin',
  'outerJoin',
  'fullOuterJoin',
  'crossJoin',
  'where',
  'andWhere',
  'orWhere',
  'whereNot',
  'orWhereNot',
  'whereRaw',
  'whereWrapped',
  'havingWrapped',
  'orWhereRaw',
  'whereExists',
  'orWhereExists',
  'whereNotExists',
  'orWhereNotExists',
  'whereIn',
  'orWhereIn',
  'whereNotIn',
  'orWhereNotIn',
  'whereNull',
  'orWhereNull',
  'whereNotNull',
  'orWhereNotNull',
  'whereBetween',
  'whereNotBetween',
  'andWhereBetween',
  'andWhereNotBetween',
  'orWhereBetween',
  'orWhereNotBetween',
  'groupBy',
  'groupByRaw',
  'orderBy',
  'orderByRaw',
  'union',
  'unionAll',
  'intersect',
  'having',
  'havingRaw',
  'orHaving',
  'orHavingRaw',
  'offset',
  'limit',
  'count',
  'countDistinct',
  'min',
  'max',
  'sum',
  'sumDistinct',
  'avg',
  'avgDistinct',
  'increment',
  'decrement',
  'first',
  'debug',
  'pluck',
  'clearSelect',
  'clearWhere',
  'clearGroup',
  'clearOrder',
  'clearHaving',
  'insert',
  'update',
  'returning',
  'del',
  'delete',
  'truncate',
  'transacting',
  'connection',
];

const { promisify: promisify$1 } = util;

var delay = promisify$1(setTimeout);

const { isNumber: isNumber$2, chunk, flatten } = lodash;

var batchInsert = function batchInsert(
  client,
  tableName,
  batch,
  chunkSize = 1000
) {
  let returning = void 0;
  let transaction = null;

  const runInTransaction = (cb) => {
    if (transaction) {
      return cb(transaction);
    }
    return client.transaction(cb);
  };

  return Object.assign(
    Promise.resolve().then(async () => {
      if (!isNumber$2(chunkSize) || chunkSize < 1) {
        throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
      }

      if (!Array.isArray(batch)) {
        throw new TypeError(
          `Invalid batch: Expected array, got ${typeof batch}`
        );
      }

      const chunks = chunk(batch, chunkSize);

      //Next tick to ensure wrapper functions are called if needed
      await delay(1);
      return runInTransaction(async (tr) => {
        const chunksResults = [];
        for (const items of chunks) {
          chunksResults.push(await tr(tableName).insert(items, returning));
        }
        return flatten(chunksResults);
      });
    }),
    {
      returning(columns) {
        returning = columns;

        return this;
      },
      transacting(tr) {
        transaction = tr;

        return this;
      },
    }
  );
};

const { EventEmitter: EventEmitter$2 } = events;

const { Migrator: Migrator$1 } = Migrator_1;

const { merge, isUndefined: isUndefined$4 } = lodash;

// Javascript does not officially support "callable objects".  Instead,
// you must create a regular Function and inject properties/methods
// into it.  In other words: you can't leverage Prototype Inheritance
// to share the property/method definitions.
//
// To work around this, we're creating an Object Property Definition.
// This allow us to quickly inject everything into the `knex` function
// via the `Object.defineProperties(..)` function.  More importantly,
// it allows the same definitions to be shared across `knex` instances.
const KNEX_PROPERTY_DEFINITIONS = {
  client: {
    get() {
      return this.context.client;
    },
    set(client) {
      this.context.client = client;
    },
    configurable: true,
  },

  userParams: {
    get() {
      return this.context.userParams;
    },
    set(userParams) {
      this.context.userParams = userParams;
    },
    configurable: true,
  },

  schema: {
    get() {
      return this.client.schemaBuilder();
    },
    configurable: true,
  },

  migrate: {
    get() {
      return new Migrator$1(this);
    },
    configurable: true,
  },

  seed: {
    get() {
      return new Seeder_1(this);
    },
    configurable: true,
  },

  fn: {
    get() {
      return new functionhelper(this.client);
    },
    configurable: true,
  },
};

// `knex` instances serve as proxies around `context` objects.  So, calling
// any of these methods on the `knex` instance will forward the call to
// the `knex.context` object. This ensures that `this` will correctly refer
// to `context` within each of these methods.
const CONTEXT_METHODS = [
  'raw',
  'batchInsert',
  'transaction',
  'transactionProvider',
  'initialize',
  'destroy',
  'ref',
  'withUserParams',
  'queryBuilder',
  'disableProcessing',
  'enableProcessing',
];

for (const m of CONTEXT_METHODS) {
  KNEX_PROPERTY_DEFINITIONS[m] = {
    value: function(...args) {
      return this.context[m](...args);
    },
    configurable: true,
  };
}

function makeKnex(client) {
  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    return createQueryBuilder(knex.context, tableName, options);
  }

  redefineProperties(knex, client);
  return knex;
}

function initContext(knexFn) {
  const knexContext = knexFn.context || {};
  Object.assign(knexContext, {
    queryBuilder() {
      return this.client.queryBuilder();
    },

    raw() {
      return this.client.raw.apply(this.client, arguments);
    },

    batchInsert(table, batch, chunkSize = 1000) {
      return batchInsert(this, table, batch, chunkSize);
    },

    // Creates a new transaction.
    // If container is provided, returns a promise for when the transaction is resolved.
    // If container is not provided, returns a promise with a transaction that is resolved
    // when transaction is ready to be used.
    transaction(container, _config) {
      const config = Object.assign({}, _config);
      config.userParams = this.userParams || {};
      if (isUndefined$4(config.doNotRejectOnRollback)) {
        // Backwards-compatibility: default value changes depending upon
        // whether or not a `container` was provided.
        config.doNotRejectOnRollback = !container;
      }

      return this._transaction(container, config);
    },

    // Internal method that actually establishes the Transaction.  It makes no assumptions
    // about the `config` or `outerTx`, and expects the caller to handle these details.
    _transaction(container, config, outerTx = null) {
      if (container) {
        const trx = this.client.transaction(container, config, outerTx);
        return trx;
      } else {
        return new Promise((resolve, reject) => {
          const trx = this.client.transaction(resolve, config, outerTx);
          trx.catch(reject);
        });
      }
    },

    transactionProvider(config) {
      let trx;
      return () => {
        if (!trx) {
          trx = this.transaction(undefined, config);
        }
        return trx;
      };
    },

    // Typically never needed, initializes the pool for a knex client.
    initialize(config) {
      return this.client.initializePool(config);
    },

    // Convenience method for tearing down the pool.
    destroy(callback) {
      return this.client.destroy(callback);
    },

    ref(ref) {
      return this.client.ref(ref);
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to disable processing of internal queries in migrations
    disableProcessing() {
      if (this.userParams.isProcessingDisabled) {
        return;
      }
      this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
      this.userParams.postProcessResponse = this.client.config.postProcessResponse;
      this.client.config.wrapIdentifier = null;
      this.client.config.postProcessResponse = null;
      this.userParams.isProcessingDisabled = true;
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
    enableProcessing() {
      if (!this.userParams.isProcessingDisabled) {
        return;
      }
      this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
      this.client.config.postProcessResponse = this.userParams.postProcessResponse;
      this.userParams.isProcessingDisabled = false;
    },

    withUserParams(params) {
      const knexClone = shallowCloneFunction(knexFn); // We need to include getters in our clone
      if (this.client) {
        knexClone.client = Object.create(this.client.constructor.prototype); // Clone client to avoid leaking listeners that are set on it
        merge(knexClone.client, this.client);
        knexClone.client.config = Object.assign({}, this.client.config); // Clone client config to make sure they can be modified independently
      }

      redefineProperties(knexClone, knexClone.client);
      _copyEventListeners('query', knexFn, knexClone);
      _copyEventListeners('query-error', knexFn, knexClone);
      _copyEventListeners('query-response', knexFn, knexClone);
      _copyEventListeners('start', knexFn, knexClone);
      knexClone.userParams = params;
      return knexClone;
    },
  });

  if (!knexFn.context) {
    knexFn.context = knexContext;
  }
}

function _copyEventListeners(eventName, sourceKnex, targetKnex) {
  const listeners = sourceKnex.listeners(eventName);
  listeners.forEach((listener) => {
    targetKnex.on(eventName, listener);
  });
}

function redefineProperties(knex, client) {
  // Allow chaining methods from the root object, before
  // any other information is specified.
  //
  // TODO: `QueryBuilder.extend(..)` allows new QueryBuilder
  //       methods to be introduced via external components.
  //       As a side-effect, it also pushes the new method names
  //       into the `QueryInterface` array.
  //
  //       The Problem: due to the way the code is currently
  //       structured, these new methods cannot be retroactively
  //       injected into existing `knex` instances!  As a result,
  //       some `knex` instances will support the methods, and
  //       others will not.
  //
  //       We should revisit this once we figure out the desired
  //       behavior / usage.  For instance: do we really want to
  //       allow external components to directly manipulate `knex`
  //       data structures?  Or, should we come up w/ a different
  //       approach that avoids side-effects / mutation?
  //
  //      (FYI: I noticed this issue because I attempted to integrate
  //       this logic directly into the `KNEX_PROPERTY_DEFINITIONS`
  //       construction.  However, `KNEX_PROPERTY_DEFINITIONS` is
  //       constructed before any `knex` instances are created.
  //       As a result, the method extensions were missing from all
  //       `knex` instances.)
  methods.forEach(function(method) {
    knex[method] = function() {
      const builder = this.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  });

  Object.defineProperties(knex, KNEX_PROPERTY_DEFINITIONS);

  initContext(knex);
  knex.client = client;

  // TODO: It looks like this field is never actually used.
  //       It should probably be removed in a future PR.
  knex.client.makeKnex = makeKnex;

  knex.userParams = {};

  // Hook up the "knex" object as an EventEmitter.
  const ee = new EventEmitter$2();
  for (const key in ee) {
    knex[key] = ee[key];
  }

  // Unfortunately, something seems to be broken in Node 6 and removing events from a clone also mutates original Knex,
  // which is highly undesirable
  if (knex._internalListeners) {
    knex._internalListeners.forEach(({ eventName, listener }) => {
      knex.client.removeListener(eventName, listener); // Remove duplicates for copies
    });
  }
  knex._internalListeners = [];

  // Passthrough all "start" and "query" events to the knex object.
  _addInternalListener(knex, 'start', (obj) => {
    knex.emit('start', obj);
  });
  _addInternalListener(knex, 'query', (obj) => {
    knex.emit('query', obj);
  });
  _addInternalListener(knex, 'query-error', (err, obj) => {
    knex.emit('query-error', err, obj);
  });
  _addInternalListener(knex, 'query-response', (response, obj, builder) => {
    knex.emit('query-response', response, obj, builder);
  });
}

function _addInternalListener(knex, eventName, listener) {
  knex.client.on(eventName, listener);
  knex._internalListeners.push({
    eventName,
    listener,
  });
}

function createQueryBuilder(knexContext, tableName, options) {
  const qb = knexContext.queryBuilder();
  if (!tableName)
    knexContext.client.logger.warn(
      'calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.'
    );
  return tableName ? qb.table(tableName, options) : qb;
}

function shallowCloneFunction(originalFunction) {
  const fnContext = Object.create(
    Object.getPrototypeOf(originalFunction),
    Object.getOwnPropertyDescriptors(originalFunction)
  );

  const knexContext = {};
  const knexFnWrapper = (tableName, options) => {
    return createQueryBuilder(knexContext, tableName, options);
  };

  const clonedFunction = knexFnWrapper.bind(fnContext);
  Object.assign(clonedFunction, originalFunction);
  clonedFunction.context = knexContext;
  return clonedFunction;
}

var makeKnex_1 = makeKnex;

// Transaction
// -------
const { EventEmitter: EventEmitter$3 } = events;

const { callbackify: callbackify$1 } = util;
const { timeout: timeout$2, KnexTimeoutError: KnexTimeoutError$2 } = timeout_1;

const debug = debug$2('knex:tx');

const { uniqueId, isUndefined: isUndefined$5 } = lodash;

// FYI: This is defined as a function instead of a constant so that
//      each Transactor can have its own copy of the default config.
//      This will minimize the impact of bugs that might be introduced
//      if a Transactor ever mutates its config.
function DEFAULT_CONFIG() {
  return {
    userParams: {},
    doNotRejectOnRollback: true,
  };
}

// Acts as a facade for a Promise, keeping the internal state
// and managing any child transactions.
class Transaction extends EventEmitter$3 {
  constructor(client, container, config = DEFAULT_CONFIG(), outerTx = null) {
    super();
    this.userParams = config.userParams;
    this.doNotRejectOnRollback = config.doNotRejectOnRollback;

    const txid = (this.txid = uniqueId('trx'));

    this.client = client;
    this.logger = client.logger;
    this.outerTx = outerTx;
    this.trxClient = undefined;
    this._completed = false;
    this._debug = client.config && client.config.debug;

    debug(
      '%s: Starting %s transaction',
      txid,
      outerTx ? 'nested' : 'top level'
    );

    // `this` can potentially serve as an `outerTx` for another
    // Transaction.  So, go ahead and establish `_lastChild` now.
    this._lastChild = Promise.resolve();

    const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();

    // FYI: As you will see in a moment, this Promise will be used to construct
    //      2 separate Promise Chains.  This ensures that each Promise Chain
    //      can establish its error-handling semantics without interfering
    //      with the other Promise Chain.
    const basePromise = _previousSibling.then(() =>
      this._evaluateContainer(config, container)
    );

    // FYI: This is the Promise Chain for EXTERNAL use.  It ensures that the
    //      caller must handle any exceptions that result from `basePromise`.
    this._promise = basePromise.then((x) => x);

    if (outerTx) {
      // FYI: This is the Promise Chain for INTERNAL use.  It serves as a signal
      //      for when the next sibling should begin its execution.  Therefore,
      //      exceptions are caught and ignored.
      outerTx._lastChild = basePromise.catch(() => {});
    }
  }

  isCompleted() {
    return (
      this._completed || (this.outerTx && this.outerTx.isCompleted()) || false
    );
  }

  begin(conn) {
    return this.query(conn, 'BEGIN;');
  }

  savepoint(conn) {
    return this.query(conn, `SAVEPOINT ${this.txid};`);
  }

  commit(conn, value) {
    return this.query(conn, 'COMMIT;', 1, value);
  }

  release(conn, value) {
    return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
  }

  rollback(conn, error) {
    return timeout$2(this.query(conn, 'ROLLBACK', 2, error), 5000).catch(
      (err) => {
        if (!(err instanceof KnexTimeoutError$2)) {
          return Promise.reject(err);
        }
        this._rejecter(error);
      }
    );
  }

  rollbackTo(conn, error) {
    return timeout$2(
      this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
      5000
    ).catch((err) => {
      if (!(err instanceof KnexTimeoutError$2)) {
        return Promise.reject(err);
      }
      this._rejecter(error);
    });
  }

  query(conn, sql, status, value) {
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        status = 2;
        value = err;
        this._completed = true;
        debug('%s error running transaction query', this.txid);
      })
      .then((res) => {
        if (status === 1) {
          this._resolver(value);
        }
        if (status === 2) {
          if (isUndefined$5(value)) {
            if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              this._resolver();
              return;
            }

            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          this._rejecter(value);
        }
        return res;
      });
    if (status === 1 || status === 2) {
      this._completed = true;
    }
    return q;
  }

  debug(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  }

  async _evaluateContainer(config, container) {
    return this.acquireConnection(config, (connection) => {
      const trxClient = (this.trxClient = makeTxClient(
        this,
        this.client,
        connection
      ));
      const init = this.client.transacting
        ? this.savepoint(connection)
        : this.begin(connection);
      const executionPromise = new Promise((resolver, rejecter) => {
        this._resolver = resolver;
        this._rejecter = rejecter;
      });

      init
        .then(() => {
          return makeTransactor(this, connection, trxClient);
        })
        .then((transactor) => {
          transactor.executionPromise = executionPromise;

          // If we've returned a "thenable" from the transaction container, assume
          // the rollback and commit are chained to this object's success / failure.
          // Directly thrown errors are treated as automatic rollbacks.
          let result;
          try {
            result = container(transactor);
          } catch (err) {
            result = Promise.reject(err);
          }
          if (result && result.then && typeof result.then === 'function') {
            result
              .then((val) => {
                return transactor.commit(val);
              })
              .catch((err) => {
                return transactor.rollback(err);
              });
          }
          return null;
        })
        .catch((e) => {
          return this._rejecter(e);
        });

      return executionPromise;
    });
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const connection =
      configConnection || (await this.client.acquireConnection());

    try {
      connection.__knexTxId = this.txid;
      return await cb(connection);
    } finally {
      if (!configConnection) {
        debug('%s: releasing connection', this.txid);
        this.client.releaseConnection(connection);
      } else {
        debug('%s: not releasing external connection', this.txid);
      }
    }
  }

  then(onResolve, onReject) {
    return this._promise.then(onResolve, onReject);
  }

  catch(onReject) {
    return this._promise.catch(onReject);
  }

  asCallback(cb) {
    callbackify$1(() => this._promise)(cb);
    return this._promise;
  }
}
finallyMixin_1(Transaction.prototype);

// The transactor is a full featured knex object, with a "commit", a "rollback"
// and a "savepoint" function. The "savepoint" is just sugar for creating a new
// transaction. If the rollback is run inside a savepoint, it rolls back to the
// last savepoint - otherwise it rolls back the transaction.
function makeTransactor(trx, connection, trxClient) {
  const transactor = makeKnex_1(trxClient);

  transactor.context.withUserParams = () => {
    throw new Error(
      'Cannot set user params on a transaction - it can only inherit params from main knex instance'
    );
  };

  transactor.isTransaction = true;
  transactor.userParams = trx.userParams || {};

  transactor.context.transaction = function(container, options) {
    if (!options) {
      options = { doNotRejectOnRollback: true };
    } else if (isUndefined$5(options.doNotRejectOnRollback)) {
      options.doNotRejectOnRollback = true;
    }

    return this._transaction(container, options, trx);
  };

  transactor.savepoint = function(container, options) {
    return transactor.transaction(container, options);
  };

  if (trx.client.transacting) {
    transactor.commit = (value) => trx.release(connection, value);
    transactor.rollback = (error) => trx.rollbackTo(connection, error);
  } else {
    transactor.commit = (value) => trx.commit(connection, value);
    transactor.rollback = (error) => trx.rollback(connection, error);
  }

  transactor.isCompleted = () => trx.isCompleted();

  return transactor;
}

// We need to make a client object which always acquires the same
// connection and does not release back into the pool.
function makeTxClient(trx, client, connection) {
  const trxClient = Object.create(client.constructor.prototype);
  trxClient.version = client.version;
  trxClient.config = client.config;
  trxClient.driver = client.driver;
  trxClient.connectionSettings = client.connectionSettings;
  trxClient.transacting = true;
  trxClient.valueForUndefined = client.valueForUndefined;
  trxClient.logger = client.logger;

  trxClient.on('query', function(arg) {
    trx.emit('query', arg);
    client.emit('query', arg);
  });

  trxClient.on('query-error', function(err, obj) {
    trx.emit('query-error', err, obj);
    client.emit('query-error', err, obj);
  });

  trxClient.on('query-response', function(response, obj, builder) {
    trx.emit('query-response', response, obj, builder);
    client.emit('query-response', response, obj, builder);
  });

  const _query = trxClient.query;
  trxClient.query = function(conn, obj) {
    const completed = trx.isCompleted();
    return new Promise(function(resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_query.call(trxClient, conn, obj));
      } catch (e) {
        reject(e);
      }
    });
  };
  const _stream = trxClient.stream;
  trxClient.stream = function(conn, obj, stream, options) {
    const completed = trx.isCompleted();
    return new Promise(function(resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_stream.call(trxClient, conn, obj, stream, options));
      } catch (e) {
        reject(e);
      }
    });
  };
  trxClient.acquireConnection = function() {
    return Promise.resolve(connection);
  };
  trxClient.releaseConnection = function() {
    return Promise.resolve();
  };

  return trxClient;
}

function completedError(trx, obj) {
  const sql = typeof obj === 'string' ? obj : obj && obj.sql;
  debug('%s: Transaction completed: %s', trx.txid, sql);
  throw new Error(
    'Transaction query already complete, run with DEBUG=knex:tx for more info'
  );
}

var transaction = Transaction;

// Query Compiler
// -------

const {
  assign: assign$2,
  bind,
  compact,
  groupBy,
  isEmpty: isEmpty$3,
  isString: isString$1,
  isUndefined: isUndefined$6,
  map: map$1,
  omitBy,
  reduce: reduce$1,
  has,
} = lodash;

const debugBindings$1 = debug$2('knex:bindings');

const components = [
  'columns',
  'join',
  'where',
  'union',
  'group',
  'having',
  'order',
  'limit',
  'offset',
  'lock',
  'waitMode',
];

// The "QueryCompiler" takes all of the query statements which
// have been gathered in the "QueryBuilder" and turns them into a
// properly formatted / bound query string.
class QueryCompiler {
  constructor(client, builder) {
    this.client = client;
    this.method = builder._method || 'select';
    this.options = builder._options;
    this.single = builder._single;
    this.timeout = builder._timeout || false;
    this.cancelOnTimeout = builder._cancelOnTimeout || false;
    this.grouped = groupBy(builder._statements, 'grouping');
    this.formatter = client.formatter(builder);
    // Used when the insert call is empty.
    this._emptyInsertValue = 'default values';
    this.first = this.select;
  }

  // Collapse the builder into a single object
  toSQL(method, tz) {
    this._undefinedInWhereClause = false;
    this.undefinedBindingsInfo = [];

    method = method || this.method;
    const val = this[method]() || '';

    const query = {
      method,
      options: reduce$1(this.options, assign$2, {}),
      timeout: this.timeout,
      cancelOnTimeout: this.cancelOnTimeout,
      bindings: this.formatter.bindings || [],
      __knexQueryUid: uuid.v1(),
    };

    Object.defineProperties(query, {
      toNative: {
        value: () => {
          return {
            sql: this.client.positionBindings(query.sql),
            bindings: this.client.prepBindings(query.bindings),
          };
        },
        enumerable: false,
      },
    });

    if (isString$1(val)) {
      query.sql = val;
    } else {
      assign$2(query, val);
    }

    if (method === 'select' || method === 'first') {
      if (this.single.as) {
        query.as = this.single.as;
      }
    }

    if (this._undefinedInWhereClause) {
      debugBindings$1(query.bindings);
      throw new Error(
        `Undefined binding(s) detected when compiling ` +
          `${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
            ', '
          )}] query: ${query.sql}`
      );
    }

    return query;
  }

  // Compiles the `select` statement, or nested sub-selects by calling each of
  // the component compilers, trimming out the empties, and returning a
  // generated query string.
  select() {
    let sql = this.with();

    const statements = components.map((component) => this[component](this));
    sql += compact(statements).join(' ');
    return sql;
  }

  pluck() {
    let toPluck = this.single.pluck;
    if (toPluck.indexOf('.') !== -1) {
      toPluck = toPluck.split('.').slice(-1)[0];
    }
    return {
      sql: this.select(),
      pluck: toPluck,
    };
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const insertValues = this.single.insert || [];
    let sql = this.with() + `insert into ${this.tableName} `;
    if (Array.isArray(insertValues)) {
      if (insertValues.length === 0) {
        return '';
      }
    } else if (typeof insertValues === 'object' && isEmpty$3(insertValues)) {
      return sql + this._emptyInsertValue;
    }

    const insertData = this._prepInsert(insertValues);
    if (typeof insertData === 'string') {
      sql += insertData;
    } else {
      if (insertData.columns.length) {
        sql += `(${this.formatter.columnize(insertData.columns)}`;
        sql += ') values (';
        let i = -1;
        while (++i < insertData.values.length) {
          if (i !== 0) sql += '), (';
          sql += this.formatter.parameterize(
            insertData.values[i],
            this.client.valueForUndefined
          );
        }
        sql += ')';
      } else if (insertValues.length === 1 && insertValues[0]) {
        sql += this._emptyInsertValue;
      } else {
        sql = '';
      }
    }
    return sql;
  }

  // Compiles the "update" query.
  update() {
    // Make sure tableName is processed by the formatter first.
    const withSQL = this.with();
    const { tableName } = this;
    const updateData = this._prepUpdate(this.single.update);
    const wheres = this.where();
    return (
      withSQL +
      `update ${this.single.only ? 'only ' : ''}${tableName}` +
      ' set ' +
      updateData.join(', ') +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles the columns in the query, specifying if an item was distinct.
  columns() {
    let distinctClause = '';
    if (this.onlyUnions()) return '';
    const columns = this.grouped.columns || [];
    let i = -1,
      sql = [];
    if (columns) {
      while (++i < columns.length) {
        const stmt = columns[i];
        if (stmt.distinct) distinctClause = 'distinct ';
        if (stmt.distinctOn) {
          distinctClause = this.distinctOn(stmt.value);
          continue;
        }
        if (stmt.type === 'aggregate') {
          sql.push(...this.aggregate(stmt));
        } else if (stmt.type === 'aggregateRaw') {
          sql.push(this.aggregateRaw(stmt));
        } else if (stmt.value && stmt.value.length > 0) {
          sql.push(this.formatter.columnize(stmt.value));
        }
      }
    }
    if (sql.length === 0) sql = ['*'];
    return (
      `select ${distinctClause}` +
      sql.join(', ') +
      (this.tableName
        ? ` from ${this.single.only ? 'only ' : ''}${this.tableName}`
        : '')
    );
  }

  _aggregate(stmt, { aliasSeparator = ' as ', distinctParentheses } = {}) {
    const value = stmt.value;
    const method = stmt.method;
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    const wrap = (identifier) => this.formatter.wrap(identifier);
    const addAlias = (value, alias) => {
      if (alias) {
        return value + aliasSeparator + wrap(alias);
      }
      return value;
    };
    const aggregateArray = (value, alias) => {
      let columns = value.map(wrap).join(', ');
      if (distinct) {
        const openParen = distinctParentheses ? '(' : ' ';
        const closeParen = distinctParentheses ? ')' : '';
        columns = distinct.trim() + openParen + columns + closeParen;
      }
      const aggregated = `${method}(${columns})`;
      return addAlias(aggregated, alias);
    };
    const aggregateString = (value, alias) => {
      const aggregated = `${method}(${distinct + wrap(value)})`;
      return addAlias(aggregated, alias);
    };

    if (Array.isArray(value)) {
      return [aggregateArray(value)];
    }

    if (typeof value === 'object') {
      if (stmt.alias) {
        throw new Error('When using an object explicit alias can not be used');
      }
      return Object.entries(value).map(([alias, column]) => {
        if (Array.isArray(column)) {
          return aggregateArray(column, alias);
        }
        return aggregateString(column, alias);
      });
    }

    // Allows us to speciy an alias for the aggregate types.
    const splitOn = value.toLowerCase().indexOf(' as ');
    let column = value;
    let { alias } = stmt;
    if (splitOn !== -1) {
      column = value.slice(0, splitOn);
      if (alias) {
        throw new Error(`Found multiple aliases for same column: ${column}`);
      }
      alias = value.slice(splitOn + 4);
    }
    return [aggregateString(column, alias)];
  }

  aggregate(stmt) {
    return this._aggregate(stmt);
  }

  aggregateRaw(stmt) {
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    return `${stmt.method}(${distinct + this.formatter.unwrapRaw(stmt.value)})`;
  }

  // Compiles all each of the `join` clauses on the query,
  // including any nested join queries.
  join() {
    let sql = '';
    let i = -1;
    const joins = this.grouped.join;
    if (!joins) return '';
    while (++i < joins.length) {
      const join = joins[i];
      const table = join.schema ? `${join.schema}.${join.table}` : join.table;
      if (i > 0) sql += ' ';
      if (join.joinType === 'raw') {
        sql += this.formatter.unwrapRaw(join.table);
      } else {
        sql += join.joinType + ' join ' + this.formatter.wrap(table);
        let ii = -1;
        while (++ii < join.clauses.length) {
          const clause = join.clauses[ii];
          if (ii > 0) {
            sql += ` ${clause.bool} `;
          } else {
            sql += ` ${clause.type === 'onUsing' ? 'using' : 'on'} `;
          }
          const val = this[clause.type].call(this, clause);
          if (val) {
            sql += val;
          }
        }
      }
    }
    return sql;
  }

  onBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  onNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  onExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  onIn(statement) {
    if (Array.isArray(statement.column)) return this.multiOnIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiOnIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compiles all `where` statements on the query.
  where() {
    const wheres = this.grouped.where;
    if (!wheres) return;
    const sql = [];
    let i = -1;
    while (++i < wheres.length) {
      const stmt = wheres[i];
      if (
        Object.prototype.hasOwnProperty.call(stmt, 'value') &&
        helpers.containsUndefined(stmt.value)
      ) {
        this.undefinedBindingsInfo.push(stmt.column);
        this._undefinedInWhereClause = true;
      }
      const val = this[stmt.type](stmt);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        } else {
          sql.push(stmt.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  group() {
    return this._groupsOrders('group');
  }

  order() {
    return this._groupsOrders('order');
  }

  // Compiles the `having` statements.
  having() {
    const havings = this.grouped.having;
    if (!havings) return '';
    const sql = ['having'];
    for (let i = 0, l = havings.length; i < l; i++) {
      const s = havings[i];
      const val = this[s.type](s);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        }
        if (sql.length > 1 || (sql.length === 1 && sql[0] !== 'having')) {
          sql.push(s.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  havingRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  havingWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  havingBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      this.formatter.parameter(statement.value)
    );
  }

  havingNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  havingExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  havingBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  havingIn(statement) {
    if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiHavingIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compile the "union" queries attached to the main query.
  union() {
    const onlyUnions = this.onlyUnions();
    const unions = this.grouped.union;
    if (!unions) return '';
    let sql = '';
    for (let i = 0, l = unions.length; i < l; i++) {
      const union = unions[i];
      if (i > 0) sql += ' ';
      if (i > 0 || !onlyUnions) sql += union.clause + ' ';
      const statement = this.formatter.rawOrFn(union.value);
      if (statement) {
        if (union.wrap) sql += '(';
        sql += statement;
        if (union.wrap) sql += ')';
      }
    }
    return sql;
  }

  // If we haven't specified any columns or a `tableName`, we're assuming this
  // is only being used for unions.
  onlyUnions() {
    return !this.grouped.columns && this.grouped.union && !this.tableName;
  }

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit) return '';
    return `limit ${this.formatter.parameter(this.single.limit)}`;
  }

  offset() {
    if (!this.single.offset) return '';
    return `offset ${this.formatter.parameter(this.single.offset)}`;
  }

  // Compiles a `delete` query.
  del() {
    // Make sure tableName is processed by the formatter first.
    const { tableName } = this;
    const withSQL = this.with();
    const wheres = this.where();
    return (
      withSQL +
      `delete from ${this.single.only ? 'only ' : ''}${tableName}` +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate ${this.tableName}`;
  }

  // Compiles the "locks".
  lock() {
    if (this.single.lock) {
      return this[this.single.lock]();
    }
  }

  // Compiles the wait mode on the locks.
  waitMode() {
    if (this.single.waitMode) {
      return this[this.single.waitMode]();
    }
  }

  // Fail on unsupported databases
  skipLocked() {
    throw new Error(
      '.skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+'
    );
  }

  // Fail on unsupported databases
  noWait() {
    throw new Error(
      '.noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+'
    );
  }

  distinctOn(value) {
    throw new Error('.distinctOn() is currently only supported on PostgreSQL');
  }

  // On Clause
  // ------

  onWrapped(clause) {
    const self = this;

    const wrapJoin = new joinclause();
    clause.value.call(wrapJoin, wrapJoin);

    let sql = '';
    wrapJoin.clauses.forEach(function(wrapClause, ii) {
      if (ii > 0) {
        sql += ` ${wrapClause.bool} `;
      }
      const val = self[wrapClause.type](wrapClause);
      if (val) {
        sql += val;
      }
    });

    if (sql.length) {
      return `(${sql})`;
    }
    return '';
  }

  onBasic(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.wrap(clause.value)
    );
  }

  onVal(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.parameter(clause.value)
    );
  }

  onRaw(clause) {
    return this.formatter.unwrapRaw(clause.value);
  }

  onUsing(clause) {
    return '(' + this.formatter.columnize(clause.column) + ')';
  }

  // Where Clause
  // ------

  whereIn(statement) {
    let columns = null;
    if (Array.isArray(statement.column)) {
      columns = `(${this.formatter.columnize(statement.column)})`;
    } else {
      columns = this.formatter.wrap(statement.column);
    }

    const values = this.formatter.values(statement.value);
    return `${columns} ${this._not(statement, 'in ')}${values}`;
  }

  whereNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  // Compiles a basic "where" clause.
  whereBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      (statement.asColumn
        ? this.formatter.wrap(statement.value)
        : this.formatter.parameter(statement.value))
    );
  }

  whereExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  whereWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  whereBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map$1(
        statement.value,
        bind(this.formatter.parameter, this.formatter)
      ).join(' and ')
    );
  }

  // Compiles a "whereRaw" query.
  whereRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  wrap(str) {
    if (str.charAt(0) !== '(') return `(${str})`;
    return str;
  }

  // Compiles all `with` statements on the query.
  with() {
    if (!this.grouped.with || !this.grouped.with.length) {
      return '';
    }
    const withs = this.grouped.with;
    if (!withs) return;
    const sql = [];
    let i = -1;
    let isRecursive = false;
    while (++i < withs.length) {
      const stmt = withs[i];
      if (stmt.recursive) {
        isRecursive = true;
      }
      const val = this[stmt.type](stmt);
      sql.push(val);
    }
    return `with ${isRecursive ? 'recursive ' : ''}${sql.join(', ')} `;
  }

  withWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value);
    return (
      (val &&
        this.formatter.columnize(statement.alias) + ' as (' + val + ')') ||
      ''
    );
  }

  // Determines whether to add a "not" prefix to the where clause.
  _not(statement, str) {
    if (statement.not) return `not ${str}`;
    return str;
  }

  _prepInsert(data) {
    const isRaw = this.formatter.rawOrFn(data);
    if (isRaw) return isRaw;
    let columns = [];
    const values = [];
    if (!Array.isArray(data)) data = data ? [data] : [];
    let i = -1;
    while (++i < data.length) {
      if (data[i] == null) break;
      if (i === 0) columns = Object.keys(data[i]).sort();
      const row = new Array(columns.length);
      const keys = Object.keys(data[i]);
      let j = -1;
      while (++j < keys.length) {
        const key = keys[j];
        let idx = columns.indexOf(key);
        if (idx === -1) {
          columns = columns.concat(key).sort();
          idx = columns.indexOf(key);
          let k = -1;
          while (++k < values.length) {
            values[k].splice(idx, 0, undefined);
          }
          row.splice(idx, 0, undefined);
        }
        row[idx] = data[i][key];
      }
      values.push(row);
    }
    return {
      columns,
      values,
    };
  }

  // "Preps" the update.
  _prepUpdate(data = {}) {
    const { counter = {} } = this.single;

    for (const column of Object.keys(counter)) {
      //Skip?
      if (has(data, column)) {
        //Needed?
        this.client.logger.warn(
          `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
        );
        continue;
      }

      let value = counter[column];

      const symbol = value < 0 ? '-' : '+';

      if (symbol === '-') {
        value = -value;
      }

      data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
    }

    data = omitBy(data, isUndefined$6);

    const vals = [];
    const columns = Object.keys(data);
    let i = -1;

    while (++i < columns.length) {
      vals.push(
        this.formatter.wrap(columns[i]) +
          ' = ' +
          this.formatter.parameter(data[columns[i]])
      );
    }

    if (isEmpty$3(vals)) {
      throw new Error(
        [
          'Empty .update() call detected!',
          'Update data does not contain any values to update.',
          'This will result in a faulty query.',
          this.single.table ? `Table: ${this.single.table}.` : '',
          this.single.update
            ? `Columns: ${Object.keys(this.single.update)}.`
            : '',
        ].join(' ')
      );
    }

    return vals;
  }

  _formatGroupsItemValue(value) {
    const { formatter } = this;
    if (value instanceof raw) {
      return formatter.unwrapRaw(value);
    } else if (value instanceof builder) {
      return '(' + formatter.columnize(value) + ')';
    } else {
      return formatter.columnize(value);
    }
  }

  // Compiles the `order by` statements.
  _groupsOrders(type) {
    const items = this.grouped[type];
    if (!items) return '';
    const { formatter } = this;
    const sql = items.map((item) => {
      const column = this._formatGroupsItemValue(item.value);
      const direction =
        type === 'order' && item.type !== 'orderByRaw'
          ? ` ${formatter.direction(item.direction)}`
          : '';
      return column + direction;
    });
    return sql.length ? type + ' by ' + sql.join(', ') : '';
  }

  // Get the table name, wrapping it if necessary.
  // Implemented as a property to prevent ordering issues as described in #704.
  get tableName() {
    if (!this._tableName) {
      // Only call this.formatter.wrap() the first time this property is accessed.
      let tableName = this.single.table;
      const schemaName = this.single.schema;

      if (tableName && schemaName) tableName = `${schemaName}.${tableName}`;

      this._tableName = tableName
        ? // Wrap subQuery with parenthesis, #3485
          this.formatter.wrap(tableName, tableName instanceof builder)
        : '';
    }
    return this._tableName;
  }
}

var compiler = QueryCompiler;

const { EventEmitter: EventEmitter$4 } = events;
const { each: each$2, toArray: toArray$1 } = lodash;
const { addQueryContext: addQueryContext$1 } = helpers;

// Constructor for the builder instance, typically called from
// `knex.builder`, accepting the current `knex` instance,
// and pulling out the `client` and `grammar` from the current
// knex instance.
function SchemaBuilder(client) {
  this.client = client;
  this._sequence = [];

  if (client.config) {
    this._debug = client.config.debug;
    saveAsyncStack(this, 4);
  }
}

inherits(SchemaBuilder, EventEmitter$4);

// Each of the schema builder methods just add to the
// "_sequence" array for consistency.
each$2(
  [
    'createTable',
    'createTableIfNotExists',
    'createSchema',
    'createSchemaIfNotExists',
    'dropSchema',
    'dropSchemaIfExists',
    'createExtension',
    'createExtensionIfNotExists',
    'dropExtension',
    'dropExtensionIfExists',
    'table',
    'alterTable',
    'hasTable',
    'hasColumn',
    'dropTable',
    'renameTable',
    'dropTableIfExists',
    'raw',
  ],
  function(method) {
    SchemaBuilder.prototype[method] = function() {
      if (method === 'createTableIfNotExists') {
        this.client.logger.warn(
          [
            'Use async .hasTable to check if table exists and then use plain .createTable. Since ',
            '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
            'query it will not work correctly if there are any alter table queries generated for ',
            'columns afterwards. To not break old migrations this function is left untouched for now',
            ', but it should not be used when writing new code and it is removed from documentation.',
          ].join('')
        );
      }
      if (method === 'table') method = 'alterTable';
      this._sequence.push({
        method,
        args: toArray$1(arguments),
      });
      return this;
    };
  }
);

_interface(SchemaBuilder);
addQueryContext$1(SchemaBuilder);

SchemaBuilder.prototype.withSchema = function(schemaName) {
  this._schema = schemaName;
  return this;
};

SchemaBuilder.prototype.toString = function() {
  return this.toQuery();
};

SchemaBuilder.prototype.toSQL = function() {
  return this.client.schemaCompiler(this).toSQL();
};

var builder$1 = SchemaBuilder;

const { isString: isString$2, tail: tail$1 } = lodash;

// Push a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function pushQuery(query) {
  if (!query) return;
  if (isString$2(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.formatter.bindings;
  }
  this.sequence.push(query);

  this.formatter = this.client.formatter(this._commonBuilder);
}

// Used in cases where we need to push some additional column specific statements.
function pushAdditional(fn) {
  const child = new this.constructor(
    this.client,
    this.tableCompiler,
    this.columnBuilder
  );
  fn.call(child, tail$1(arguments));
  this.sequence.additional = (this.sequence.additional || []).concat(
    child.sequence
  );
}

// Unshift a new query onto the compiled "sequence" stack,
// creating a new formatter, returning the compiler.
function unshiftQuery(query) {
  if (!query) return;
  if (isString$2(query)) {
    query = { sql: query };
  }
  if (!query.bindings) {
    query.bindings = this.formatter.bindings;
  }
  this.sequence.unshift(query);

  this.formatter = this.client.formatter(this._commonBuilder);
}

var helpers$1 = {
  pushAdditional,
  pushQuery,
  unshiftQuery,
};

const {
  pushQuery: pushQuery$1,
  pushAdditional: pushAdditional$1,
  unshiftQuery: unshiftQuery$1,
} = helpers$1;

const { isUndefined: isUndefined$7 } = lodash;

// The "SchemaCompiler" takes all of the query statements which have been
// gathered in the "SchemaBuilder" and turns them into an array of
// properly formatted / bound query strings.
function SchemaCompiler(client, builder) {
  this.builder = builder;
  this._commonBuilder = this.builder;
  this.client = client;
  this.schema = builder._schema;
  this.formatter = client.formatter(builder);
  this.sequence = [];
}

function throwOnlyPGError(operationName) {
  throw new Error(
    `${operationName} is not supported for this dialect (only PostgreSQL supports it currently).`
  );
}

Object.assign(SchemaCompiler.prototype, {
  pushQuery: pushQuery$1,

  pushAdditional: pushAdditional$1,

  unshiftQuery: unshiftQuery$1,

  createTable: buildTable('create'),

  createTableIfNotExists: buildTable('createIfNot'),

  createSchema: () => {
    throwOnlyPGError('createSchema');
  },
  createSchemaIfNotExists: () => {
    throwOnlyPGError('createSchemaIfNotExists');
  },
  dropSchema: () => {
    throwOnlyPGError('dropSchema');
  },
  dropSchemaIfExists: () => {
    throwOnlyPGError('dropSchemaIfExists');
  },

  alterTable: buildTable('alter'),

  dropTablePrefix: 'drop table ',

  dropTable(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  },

  dropTableIfExists(tableName) {
    this.pushQuery(
      this.dropTablePrefix +
        'if exists ' +
        this.formatter.wrap(prefixedTableName(this.schema, tableName))
    );
  },

  raw(sql, bindings) {
    this.sequence.push(this.client.raw(sql, bindings).toSQL());
  },

  toSQL() {
    const sequence = this.builder._sequence;
    for (let i = 0, l = sequence.length; i < l; i++) {
      const query = sequence[i];
      this[query.method].apply(this, query.args);
    }
    return this.sequence;
  },
});

function buildTable(type) {
  return function(tableName, fn) {
    const builder = this.client.tableBuilder(type, tableName, fn);

    // pass queryContext down to tableBuilder but do not overwrite it if already set
    const queryContext = this.builder.queryContext();
    if (!isUndefined$7(queryContext) && isUndefined$7(builder.queryContext())) {
      builder.queryContext(queryContext);
    }

    builder.setSchema(this.schema);
    const sql = builder.toSQL();

    for (let i = 0, l = sql.length; i < l; i++) {
      this.sequence.push(sql[i]);
    }
  };
}

function prefixedTableName(prefix, table) {
  return prefix ? `${prefix}.${table}` : table;
}

var compiler$1 = SchemaCompiler;

// TableBuilder

// Takes the function passed to the "createTable" or "table/editTable"
// functions and calls it with the "TableBuilder" as both the context and
// the first argument. Inside this function we can specify what happens to the
// method, pushing everything we want to do onto the "allStatements" array,
// which is then compiled into sql.
// ------
const {
  extend: extend$1,
  each: each$3,
  toArray: toArray$2,
  isString: isString$3,
  isFunction: isFunction$3,
} = lodash;

function TableBuilder(client, method, tableName, fn) {
  this.client = client;
  this._fn = fn;
  this._method = method;
  this._schemaName = undefined;
  this._tableName = tableName;
  this._statements = [];
  this._single = {};

  if (!isFunction$3(this._fn)) {
    throw new TypeError(
      'A callback function must be supplied to calls against `.createTable` ' +
        'and `.table`'
    );
  }
}

TableBuilder.prototype.setSchema = function(schemaName) {
  this._schemaName = schemaName;
};

// Convert the current tableBuilder object "toSQL"
// giving us additional methods if we're altering
// rather than creating the table.
TableBuilder.prototype.toSQL = function() {
  if (this._method === 'alter') {
    extend$1(this, AlterMethods);
  }
  this._fn.call(this, this);
  return this.client.tableCompiler(this).toSQL();
};

each$3(
  [
    // Each of the index methods can be called individually, with the
    // column name to be used, e.g. table.unique('column').
    'index',
    'primary',
    'unique',

    // Key specific
    'dropPrimary',
    'dropUnique',
    'dropIndex',
    'dropForeign',
  ],
  function(method) {
    TableBuilder.prototype[method] = function() {
      this._statements.push({
        grouping: 'alterTable',
        method,
        args: toArray$2(arguments),
      });
      return this;
    };
  }
);

// Warn for dialect-specific table methods, since that's the
// only time these are supported.
const specialMethods = {
  mysql: ['engine', 'charset', 'collate'],
  postgresql: ['inherits'],
};
each$3(specialMethods, function(methods, dialect) {
  each$3(methods, function(method) {
    TableBuilder.prototype[method] = function(value) {
      if (this.client.dialect !== dialect) {
        throw new Error(
          `Knex only supports ${method} statement with ${dialect}.`
        );
      }
      if (this._method === 'alter') {
        throw new Error(
          `Knex does not support altering the ${method} outside of create ` +
            `table, please use knex.raw statement.`
        );
      }
      this._single[method] = value;
    };
  });
});

helpers.addQueryContext(TableBuilder);

// Each of the column types that we can add, we create a new ColumnBuilder
// instance and push it onto the statements array.
const columnTypes = [
  // Numeric
  'tinyint',
  'smallint',
  'mediumint',
  'int',
  'bigint',
  'decimal',
  'float',
  'double',
  'real',
  'bit',
  'boolean',
  'serial',

  // Date / Time
  'date',
  'datetime',
  'timestamp',
  'time',
  'year',

  // String
  'char',
  'varchar',
  'tinytext',
  'tinyText',
  'text',
  'mediumtext',
  'mediumText',
  'longtext',
  'longText',
  'binary',
  'varbinary',
  'tinyblob',
  'tinyBlob',
  'mediumblob',
  'mediumBlob',
  'blob',
  'longblob',
  'longBlob',
  'enum',
  'set',

  // Increments, Aliases, and Additional
  'bool',
  'dateTime',
  'increments',
  'bigincrements',
  'bigIncrements',
  'integer',
  'biginteger',
  'bigInteger',
  'string',
  'json',
  'jsonb',
  'uuid',
  'enu',
  'specificType',
];

// For each of the column methods, create a new "ColumnBuilder" interface,
// push it onto the "allStatements" stack, and then return the interface,
// with which we can add indexes, etc.
each$3(columnTypes, function(type) {
  TableBuilder.prototype[type] = function() {
    const args = toArray$2(arguments);
    const builder = this.client.columnBuilder(this, type, args);
    this._statements.push({
      grouping: 'columns',
      builder,
    });
    return builder;
  };
});

// The "timestamps" call is really just sets the `created_at` and `updated_at` columns.
TableBuilder.prototype.timestamps = function timestamps() {
  const method = arguments[0] === true ? 'timestamp' : 'datetime';
  const createdAt = this[method]('created_at');
  const updatedAt = this[method]('updated_at');
  if (arguments[1] === true) {
    const now = this.client.raw('CURRENT_TIMESTAMP');
    createdAt.notNullable().defaultTo(now);
    updatedAt.notNullable().defaultTo(now);
  }
  return;
};

// Set the comment value for a table, they're only allowed to be called
// once per table.
TableBuilder.prototype.comment = function(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Table comment must be string');
  }
  this._single.comment = value;
};

// Set a foreign key on the table, calling
// `table.foreign('column_name').references('column').on('table').onDelete()...
// Also called from the ColumnBuilder context when chaining.
TableBuilder.prototype.foreign = function(column, keyName) {
  const foreignData = { column: column, keyName: keyName };
  this._statements.push({
    grouping: 'alterTable',
    method: 'foreign',
    args: [foreignData],
  });
  let returnObj = {
    references(tableColumn) {
      let pieces;
      if (isString$3(tableColumn)) {
        pieces = tableColumn.split('.');
      }
      if (!pieces || pieces.length === 1) {
        foreignData.references = pieces ? pieces[0] : tableColumn;
        return {
          on(tableName) {
            if (typeof tableName !== 'string') {
              throw new TypeError(
                `Expected tableName to be a string, got: ${typeof tableName}`
              );
            }
            foreignData.inTable = tableName;
            return returnObj;
          },
          inTable() {
            return this.on.apply(this, arguments);
          },
        };
      }
      foreignData.inTable = pieces[0];
      foreignData.references = pieces[1];
      return returnObj;
    },
    withKeyName(keyName) {
      foreignData.keyName = keyName;
      return returnObj;
    },
    onUpdate(statement) {
      foreignData.onUpdate = statement;
      return returnObj;
    },
    onDelete(statement) {
      foreignData.onDelete = statement;
      return returnObj;
    },
    _columnBuilder(builder) {
      extend$1(builder, returnObj);
      returnObj = builder;
      return builder;
    },
  };
  return returnObj;
};

const AlterMethods = {
  // Renames the current column `from` the current
  // TODO: this.column(from).rename(to)
  renameColumn(from, to) {
    this._statements.push({
      grouping: 'alterTable',
      method: 'renameColumn',
      args: [from, to],
    });
    return this;
  },

  dropTimestamps() {
    return this.dropColumns(['created_at', 'updated_at']);
  },

  // TODO: changeType
};

// Drop a column from the current table.
// TODO: Enable this.column(columnName).drop();
AlterMethods.dropColumn = AlterMethods.dropColumns = function() {
  this._statements.push({
    grouping: 'alterTable',
    method: 'dropColumn',
    args: toArray$2(arguments),
  });
  return this;
};

var tablebuilder = TableBuilder;

/* eslint max-len:0 */

// Table Compiler
// -------
const {
  pushAdditional: pushAdditional$2,
  pushQuery: pushQuery$2,
  unshiftQuery: unshiftQuery$2,
} = helpers$1;

const {
  groupBy: groupBy$1,
  reduce: reduce$2,
  map: map$2,
  first,
  tail: tail$2,
  isEmpty: isEmpty$4,
  indexOf,
  isArray: isArray$1,
  isUndefined: isUndefined$8,
} = lodash;

function TableCompiler(client, tableBuilder) {
  this.client = client;
  this.tableBuilder = tableBuilder;
  this._commonBuilder = this.tableBuilder;
  this.method = tableBuilder._method;
  this.schemaNameRaw = tableBuilder._schemaName;
  this.tableNameRaw = tableBuilder._tableName;
  this.single = tableBuilder._single;
  this.grouped = groupBy$1(tableBuilder._statements, 'grouping');
  this.formatter = client.formatter(tableBuilder);
  this.sequence = [];
  this._formatting = client.config && client.config.formatting;
}

TableCompiler.prototype.pushQuery = pushQuery$2;

TableCompiler.prototype.pushAdditional = pushAdditional$2;

TableCompiler.prototype.unshiftQuery = unshiftQuery$2;

// Convert the tableCompiler toSQL
TableCompiler.prototype.toSQL = function() {
  this[this.method]();
  return this.sequence;
};

TableCompiler.prototype.lowerCase = true;

// Column Compilation
// -------

// If this is a table "creation", we need to first run through all
// of the columns to build them into a single string,
// and then run through anything else and push it to the query sequence.
TableCompiler.prototype.createAlterTableMethods = null;
TableCompiler.prototype.create = function(ifNot) {
  const columnBuilders = this.getColumns();
  const columns = columnBuilders.map((col) => col.toSQL());
  const columnTypes = this.getColumnTypes(columns);
  if (this.createAlterTableMethods) {
    this.alterTableForCreate(columnTypes);
  }
  this.createQuery(columnTypes, ifNot);
  this.columnQueries(columns);
  delete this.single.comment;
  this.alterTable();
};

// Only create the table if it doesn't exist.
TableCompiler.prototype.createIfNot = function() {
  this.create(true);
};

// If we're altering the table, we need to one-by-one
// go through and handle each of the queries associated
// with altering the table's schema.
TableCompiler.prototype.alter = function() {
  const addColBuilders = this.getColumns();
  const addColumns = addColBuilders.map((col) => col.toSQL());
  const alterColBuilders = this.getColumns('alter');
  const alterColumns = alterColBuilders.map((col) => col.toSQL());
  const addColumnTypes = this.getColumnTypes(addColumns);
  const alterColumnTypes = this.getColumnTypes(alterColumns);

  this.addColumns(addColumnTypes);
  this.alterColumns(alterColumnTypes, alterColBuilders);
  this.columnQueries(addColumns);
  this.columnQueries(alterColumns);
  this.alterTable();
};

TableCompiler.prototype.foreign = function(foreignData) {
  if (foreignData.inTable && foreignData.references) {
    const keyName = foreignData.keyName
      ? this.formatter.wrap(foreignData.keyName)
      : this._indexCommand('foreign', this.tableNameRaw, foreignData.column);
    const column = this.formatter.columnize(foreignData.column);
    const references = this.formatter.columnize(foreignData.references);
    const inTable = this.formatter.wrap(foreignData.inTable);
    const onUpdate = foreignData.onUpdate
      ? (this.lowerCase ? ' on update ' : ' ON UPDATE ') + foreignData.onUpdate
      : '';
    const onDelete = foreignData.onDelete
      ? (this.lowerCase ? ' on delete ' : ' ON DELETE ') + foreignData.onDelete
      : '';
    if (this.lowerCase) {
      this.pushQuery(
        (!this.forCreate ? `alter table ${this.tableName()} add ` : '') +
          'constraint ' +
          keyName +
          ' ' +
          'foreign key (' +
          column +
          ') references ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    } else {
      this.pushQuery(
        (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : '') +
          'CONSTRAINT ' +
          keyName +
          ' ' +
          'FOREIGN KEY (' +
          column +
          ') REFERENCES ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    }
  }
};

// Get all of the column sql & bindings individually for building the table queries.
TableCompiler.prototype.getColumnTypes = (columns) =>
  reduce$2(
    map$2(columns, first),
    function(memo, column) {
      memo.sql.push(column.sql);
      memo.bindings.concat(column.bindings);
      return memo;
    },
    { sql: [], bindings: [] }
  );

// Adds all of the additional queries from the "column"
TableCompiler.prototype.columnQueries = function(columns) {
  const queries = reduce$2(
    map$2(columns, tail$2),
    function(memo, column) {
      if (!isEmpty$4(column)) return memo.concat(column);
      return memo;
    },
    []
  );
  for (const q of queries) {
    this.pushQuery(q);
  }
};

// Add a new column.
TableCompiler.prototype.addColumnsPrefix = 'add column ';

// All of the columns to "add" for the query
TableCompiler.prototype.addColumns = function(columns, prefix) {
  prefix = prefix || this.addColumnsPrefix;

  if (columns.sql.length > 0) {
    const columnSql = map$2(columns.sql, (column) => {
      return prefix + column;
    });
    this.pushQuery({
      sql:
        (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
        this.tableName() +
        ' ' +
        columnSql.join(', '),
      bindings: columns.bindings,
    });
  }
};

// Alter column
TableCompiler.prototype.alterColumnsPrefix = 'alter column ';

TableCompiler.prototype.alterColumns = function(columns, colBuilders) {
  if (columns.sql.length > 0) {
    this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
  }
};

// Compile the columns as needed for the current create or alter table
TableCompiler.prototype.getColumns = function(method) {
  const columns = this.grouped.columns || [];
  method = method || 'add';

  const queryContext = this.tableBuilder.queryContext();

  return columns
    .filter((column) => column.builder._method === method)
    .map((column) => {
      // pass queryContext down to columnBuilder but do not overwrite it if already set
      if (
        !isUndefined$8(queryContext) &&
        isUndefined$8(column.builder.queryContext())
      ) {
        column.builder.queryContext(queryContext);
      }
      return this.client.columnCompiler(this, column.builder);
    });
};

TableCompiler.prototype.tableName = function() {
  const name = this.schemaNameRaw
    ? `${this.schemaNameRaw}.${this.tableNameRaw}`
    : this.tableNameRaw;

  return this.formatter.wrap(name);
};

// Generate all of the alter column statements necessary for the query.
TableCompiler.prototype.alterTable = function() {
  const alterTable = this.grouped.alterTable || [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (this[statement.method]) {
      this[statement.method].apply(this, statement.args);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  for (const item in this.single) {
    if (typeof this[item] === 'function') this[item](this.single[item]);
  }
};

TableCompiler.prototype.alterTableForCreate = function(columnTypes) {
  this.forCreate = true;
  const savedSequence = this.sequence;
  const alterTable = this.grouped.alterTable || [];
  this.grouped.alterTable = [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
      this.grouped.alterTable.push(statement);
      continue;
    }
    if (this[statement.method]) {
      this.sequence = [];
      this[statement.method].apply(this, statement.args);
      columnTypes.sql.push(this.sequence[0].sql);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  this.sequence = savedSequence;
  this.forCreate = false;
};

// Drop the index on the current table.
TableCompiler.prototype.dropIndex = function(value) {
  this.pushQuery(`drop index${value}`);
};

// Drop the unique
TableCompiler.prototype.dropUnique = TableCompiler.prototype.dropForeign = function() {
  throw new Error('Method implemented in the dialect driver');
};

TableCompiler.prototype.dropColumnPrefix = 'drop column ';
TableCompiler.prototype.dropColumn = function() {
  const columns = helpers.normalizeArr.apply(null, arguments);
  const drops = map$2(isArray$1(columns) ? columns : [columns], (column) => {
    return this.dropColumnPrefix + this.formatter.wrap(column);
  });
  this.pushQuery(
    (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
      this.tableName() +
      ' ' +
      drops.join(', ')
  );
};

// If no name was specified for this index, we will create one using a basic
// convention of the table name, followed by the columns, followed by an
// index type, such as primary or index, which makes the index unique.
TableCompiler.prototype._indexCommand = function(type, tableName, columns) {
  if (!isArray$1(columns)) columns = columns ? [columns] : [];
  const table = tableName.replace(/\.|-/g, '_');
  const indexName = (
    table +
    '_' +
    columns.join('_') +
    '_' +
    type
  ).toLowerCase();
  return this.formatter.wrap(indexName);
};

var tablecompiler = TableCompiler;

const { extend: extend$2, each: each$4, toArray: toArray$3 } = lodash;
const { addQueryContext: addQueryContext$2 } = helpers;

// The chainable interface off the original "column" method.
function ColumnBuilder(client, tableBuilder, type, args) {
  this.client = client;
  this._method = 'add';
  this._single = {};
  this._modifiers = {};
  this._statements = [];
  this._type = columnAlias[type] || type;
  this._args = args;
  this._tableBuilder = tableBuilder;

  // If we're altering the table, extend the object
  // with the available "alter" methods.
  if (tableBuilder._method === 'alter') {
    extend$2(this, AlterMethods$1);
  }
}

// All of the modifier methods that can be used to modify the current query.
const modifiers = [
  'default',
  'defaultsTo',
  'defaultTo',
  'unsigned',
  'nullable',
  'first',
  'after',
  'comment',
  'collate',
];

// Aliases for convenience.
const aliasMethod = {
  default: 'defaultTo',
  defaultsTo: 'defaultTo',
};

// If we call any of the modifiers (index or otherwise) on the chainable, we pretend
// as though we're calling `table.method(column)` directly.
each$4(modifiers, function(method) {
  const key = aliasMethod[method] || method;
  ColumnBuilder.prototype[method] = function() {
    this._modifiers[key] = toArray$3(arguments);
    return this;
  };
});

addQueryContext$2(ColumnBuilder);

ColumnBuilder.prototype.notNull = ColumnBuilder.prototype.notNullable = function notNullable() {
  return this.nullable(false);
};

each$4(['index', 'primary', 'unique'], function(method) {
  ColumnBuilder.prototype[method] = function() {
    if (this._type.toLowerCase().indexOf('increments') === -1) {
      this._tableBuilder[method].apply(
        this._tableBuilder,
        [this._args[0]].concat(toArray$3(arguments))
      );
    }
    return this;
  };
});

// Specify that the current column "references" a column,
// which may be tableName.column or just "column"
ColumnBuilder.prototype.references = function(value) {
  return this._tableBuilder.foreign
    .call(this._tableBuilder, this._args[0], undefined, this)
    ._columnBuilder(this)
    .references(value);
};

const AlterMethods$1 = {};

// Specify that the column is to be dropped. This takes precedence
// over all other rules for the column.
AlterMethods$1.drop = function() {
  this._single.drop = true;

  return this;
};

// Specify the "type" that we're looking to set the
// Knex takes no responsibility for any data-loss that may
// occur when changing data types.
AlterMethods$1.alterType = function(type) {
  this._statements.push({
    grouping: 'alterType',
    value: type,
  });

  return this;
};

// Set column method to alter (default is add).
AlterMethods$1.alter = function() {
  this._method = 'alter';

  return this;
};

// Alias a few methods for clarity when processing.
const columnAlias = {
  float: 'floating',
  enum: 'enu',
  boolean: 'bool',
  string: 'varchar',
  bigint: 'bigInteger',
};

var columnbuilder = ColumnBuilder;

// Column Compiler
// Used for designating column definitions
// during the table "create" / "alter" statements.
// -------

const {
  groupBy: groupBy$2,
  first: first$1,
  tail: tail$3,
  has: has$1,
  isObject: isObject$2,
} = lodash;

function ColumnCompiler(client, tableCompiler, columnBuilder) {
  this.client = client;
  this.tableCompiler = tableCompiler;
  this.columnBuilder = columnBuilder;
  this._commonBuilder = this.columnBuilder;
  this.args = columnBuilder._args;
  this.type = columnBuilder._type.toLowerCase();
  this.grouped = groupBy$2(columnBuilder._statements, 'grouping');
  this.modified = columnBuilder._modifiers;
  this.isIncrements = this.type.indexOf('increments') !== -1;
  this.formatter = client.formatter(columnBuilder);
  this.sequence = [];
  this.modifiers = [];
}

ColumnCompiler.prototype.pushQuery = helpers$1.pushQuery;

ColumnCompiler.prototype.pushAdditional = helpers$1.pushAdditional;

ColumnCompiler.prototype.unshiftQuery = helpers$1.unshiftQuery;

ColumnCompiler.prototype._defaultMap = {
  columnName: function() {
    if (!this.isIncrements) {
      throw new Error(
        `You did not specify a column name for the ${this.type} column.`
      );
    }
    return 'id';
  },
};

ColumnCompiler.prototype.defaults = function(label) {
  if (Object.prototype.hasOwnProperty.call(this._defaultMap, label)) {
    return this._defaultMap[label].bind(this)();
  } else {
    throw new Error(
      `There is no default for the specified identifier ${label}`
    );
  }
};

// To convert to sql, we first go through and build the
// column as it would be in the insert statement
ColumnCompiler.prototype.toSQL = function() {
  this.pushQuery(this.compileColumn());
  if (this.sequence.additional) {
    this.sequence = this.sequence.concat(this.sequence.additional);
  }
  return this.sequence;
};

// Compiles a column.
ColumnCompiler.prototype.compileColumn = function() {
  return (
    this.formatter.wrap(this.getColumnName()) +
    ' ' +
    this.getColumnType() +
    this.getModifiers()
  );
};

// Assumes the autoincrementing key is named `id` if not otherwise specified.
ColumnCompiler.prototype.getColumnName = function() {
  const value = first$1(this.args);
  return value || this.defaults('columnName');
};

ColumnCompiler.prototype.getColumnType = function() {
  const type = this[this.type];
  return typeof type === 'function'
    ? type.apply(this, tail$3(this.args))
    : type;
};

ColumnCompiler.prototype.getModifiers = function() {
  const modifiers = [];

  for (let i = 0, l = this.modifiers.length; i < l; i++) {
    const modifier = this.modifiers[i];

    //Cannot allow 'nullable' modifiers on increments types
    if (!this.isIncrements || (this.isIncrements && modifier === 'comment')) {
      if (has$1(this.modified, modifier)) {
        const val = this[modifier].apply(this, this.modified[modifier]);
        if (val) modifiers.push(val);
      }
    }
  }

  return modifiers.length > 0 ? ` ${modifiers.join(' ')}` : '';
};

// Types
// ------

ColumnCompiler.prototype.increments =
  'integer not null primary key autoincrement';
ColumnCompiler.prototype.bigincrements =
  'integer not null primary key autoincrement';
ColumnCompiler.prototype.integer = ColumnCompiler.prototype.smallint = ColumnCompiler.prototype.mediumint =
  'integer';
ColumnCompiler.prototype.biginteger = 'bigint';
ColumnCompiler.prototype.varchar = function(length) {
  return `varchar(${this._num(length, 255)})`;
};
ColumnCompiler.prototype.text = 'text';
ColumnCompiler.prototype.tinyint = 'tinyint';
ColumnCompiler.prototype.floating = function(precision, scale) {
  return `float(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
};
ColumnCompiler.prototype.decimal = function(precision, scale) {
  if (precision === null) {
    throw new Error(
      'Specifying no precision on decimal columns is not supported for that SQL dialect.'
    );
  }
  return `decimal(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
};
ColumnCompiler.prototype.binary = 'blob';
ColumnCompiler.prototype.bool = 'boolean';
ColumnCompiler.prototype.date = 'date';
ColumnCompiler.prototype.datetime = 'datetime';
ColumnCompiler.prototype.time = 'time';
ColumnCompiler.prototype.timestamp = 'timestamp';
ColumnCompiler.prototype.enu = 'varchar';

ColumnCompiler.prototype.bit = ColumnCompiler.prototype.json = 'text';

ColumnCompiler.prototype.uuid = 'char(36)';
ColumnCompiler.prototype.specifictype = (type) => type;

// Modifiers
// -------

ColumnCompiler.prototype.nullable = (nullable) =>
  nullable === false ? 'not null' : 'null';
ColumnCompiler.prototype.notNullable = function() {
  return this.nullable(false);
};
ColumnCompiler.prototype.defaultTo = function(value) {
  if (value === void 0) {
    return '';
  } else if (value === null) {
    value = 'null';
  } else if (value instanceof raw) {
    value = value.toQuery();
  } else if (this.type === 'bool') {
    if (value === 'false') value = 0;
    value = `'${value ? 1 : 0}'`;
  } else if (
    (this.type === 'json' || this.type === 'jsonb') &&
    isObject$2(value)
  ) {
    value = `'${JSON.stringify(value)}'`;
  } else {
    value = `'${value}'`;
  }
  return `default ${value}`;
};
ColumnCompiler.prototype._num = function(val, fallback) {
  if (val === undefined || val === null) return fallback;
  const number = parseInt(val, 10);
  return isNaN(number) ? fallback : number;
};

var columncompiler = ColumnCompiler;

/*eslint max-len: 0, no-var:0 */

const charsRegex = /[\0\b\t\n\r\x1a"'\\]/g; // eslint-disable-line no-control-regex
const charsMap = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\',
};

function wrapEscape(escapeFn) {
  return function finalEscape(val, ctx = {}) {
    return escapeFn(val, finalEscape, ctx);
  };
}

function makeEscape(config = {}) {
  const finalEscapeDate = config.escapeDate || dateToString;
  const finalEscapeArray = config.escapeArray || arrayToList;
  const finalEscapeBuffer = config.escapeBuffer || bufferToString;
  const finalEscapeString = config.escapeString || escapeString;
  const finalEscapeObject = config.escapeObject || escapeObject;
  const finalWrap = config.wrap || wrapEscape;

  function escapeFn(val, finalEscape, ctx) {
    if (val === undefined || val === null) {
      return 'NULL';
    }
    switch (typeof val) {
      case 'boolean':
        return val ? 'true' : 'false';
      case 'number':
        return val + '';
      case 'object':
        if (val instanceof Date) {
          val = finalEscapeDate(val, finalEscape, ctx);
        } else if (Array.isArray(val)) {
          return finalEscapeArray(val, finalEscape, ctx);
        } else if (Buffer.isBuffer(val)) {
          return finalEscapeBuffer(val, finalEscape, ctx);
        } else {
          return finalEscapeObject(val, finalEscape, ctx);
        }
    }
    return finalEscapeString(val, finalEscape, ctx);
  }

  return finalWrap ? finalWrap(escapeFn) : escapeFn;
}

function escapeObject(val, finalEscape, ctx) {
  if (val && typeof val.toSQL === 'function') {
    return val.toSQL(ctx);
  } else {
    return JSON.stringify(val);
  }
}

function arrayToList(array, finalEscape, ctx) {
  let sql = '';
  for (let i = 0; i < array.length; i++) {
    const val = array[i];
    if (Array.isArray(val)) {
      sql +=
        (i === 0 ? '' : ', ') + '(' + arrayToList(val, finalEscape, ctx) + ')';
    } else {
      sql += (i === 0 ? '' : ', ') + finalEscape(val, ctx);
    }
  }
  return sql;
}

function bufferToString(buffer) {
  return 'X' + escapeString(buffer.toString('hex'));
}

function escapeString(val, finalEscape, ctx) {
  let chunkIndex = (charsRegex.lastIndex = 0);
  let escapedVal = '';
  let match;

  while ((match = charsRegex.exec(val))) {
    escapedVal += val.slice(chunkIndex, match.index) + charsMap[match[0]];
    chunkIndex = charsRegex.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}

function dateToString(date, finalEscape, ctx = {}) {
  const timeZone = ctx.timeZone || 'local';

  const dt = new Date(date);
  let year;
  let month;
  let day;
  let hour;
  let minute;
  let second;
  let millisecond;

  if (timeZone === 'local') {
    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
    hour = dt.getHours();
    minute = dt.getMinutes();
    second = dt.getSeconds();
    millisecond = dt.getMilliseconds();
  } else {
    const tz = convertTimezone(timeZone);

    if (tz !== false && tz !== 0) {
      dt.setTime(dt.getTime() + tz * 60000);
    }

    year = dt.getUTCFullYear();
    month = dt.getUTCMonth() + 1;
    day = dt.getUTCDate();
    hour = dt.getUTCHours();
    minute = dt.getUTCMinutes();
    second = dt.getUTCSeconds();
    millisecond = dt.getUTCMilliseconds();
  }

  // YYYY-MM-DD HH:mm:ss.mmm
  return (
    zeroPad(year, 4) +
    '-' +
    zeroPad(month, 2) +
    '-' +
    zeroPad(day, 2) +
    ' ' +
    zeroPad(hour, 2) +
    ':' +
    zeroPad(minute, 2) +
    ':' +
    zeroPad(second, 2) +
    '.' +
    zeroPad(millisecond, 3)
  );
}

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}

function convertTimezone(tz) {
  if (tz === 'Z') {
    return 0;
  }
  const m = tz.match(/([+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (
      (m[1] == '-' ? -1 : 1) *
      (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) *
      60
    );
  }
  return false;
}

var string = {
  arrayToList,
  bufferToString,
  dateToString,
  escapeString,
  charsRegex,
  charsMap,
  escapeObject,
  makeEscape,
};

/* eslint no-console:0 */

const { inspect } = util;
const {
  isFunction: isFunction$4,
  isNil: isNil$1,
  isString: isString$4,
} = lodash;

class Logger {
  constructor(config) {
    const {
      log: {
        debug,
        warn,
        error,
        deprecate,
        inspectionDepth,
        enableColors,
      } = {},
    } = config;
    this._inspectionDepth = inspectionDepth || 5;
    this._enableColors = resolveIsEnabledColors(enableColors);
    this._debug = debug;
    this._warn = warn;
    this._error = error;
    this._deprecate = deprecate;
  }

  _log(message, userFn, colorFn) {
    if (!isNil$1(userFn) && !isFunction$4(userFn)) {
      throw new TypeError('Extensions to knex logger must be functions!');
    }

    if (isFunction$4(userFn)) {
      userFn(message);
      return;
    }

    if (!isString$4(message)) {
      message = inspect(message, {
        depth: this._inspectionDepth,
        colors: this._enableColors,
      });
    }

    console.log(colorFn ? colorFn(message) : message);
  }

  debug(message) {
    this._log(message, this._debug);
  }

  warn(message) {
    this._log(message, this._warn, colorette.yellow);
  }

  error(message) {
    this._log(message, this._error, colorette.red);
  }

  deprecate(method, alternative) {
    const message = `${method} is deprecated, please use ${alternative}`;

    this._log(message, this._deprecate, colorette.yellow);
  }
}

function resolveIsEnabledColors(enableColorsParam) {
  if (!isNil$1(enableColorsParam)) {
    return enableColorsParam;
  }

  if (process && process.stdout) {
    return process.stdout.isTTY;
  }

  return false;
}

var logger = Logger;

const { Pool, TimeoutError } = tarn;

const { EventEmitter: EventEmitter$5 } = events;
const { promisify: promisify$2 } = util;

const { makeEscape: makeEscape$1 } = string;
const { uniqueId: uniqueId$1, cloneDeep, defaults } = lodash;

const { KnexTimeoutError: KnexTimeoutError$3 } = timeout_1;

const debug$1 = debug$2('knex:client');
const _debugQuery = debug$2('knex:query');
const debugBindings$2 = debug$2('knex:bindings');

const debugQuery = (sql, txId) => _debugQuery(sql.replace(/%/g, '%%'), txId);

const { POOL_CONFIG_OPTIONS: POOL_CONFIG_OPTIONS$1 } = constants;

// The base client provides the general structure
// for a dialect specific client object.
function Client(config = {}) {
  this.config = config;
  this.logger = new logger(config);

  //Client is a required field, so throw error if it's not supplied.
  //If 'this.dialect' is set, then this is a 'super()' call, in which case
  //'client' does not have to be set as it's already assigned on the client prototype.

  if (this.dialect && !this.config.client) {
    this.logger.warn(
      `Using 'this.dialect' to identify the client is deprecated and support for it will be removed in the future. Please use configuration option 'client' instead.`
    );
  }
  const dbClient = this.config.client || this.dialect;
  if (!dbClient) {
    throw new Error(`knex: Required configuration option 'client' is missing.`);
  }

  if (config.version) {
    this.version = config.version;
  }

  if (config.connection && config.connection instanceof Function) {
    this.connectionConfigProvider = config.connection;
    this.connectionConfigExpirationChecker = () => true; // causes the provider to be called on first use
  } else {
    this.connectionSettings = cloneDeep(config.connection || {});
    this.connectionConfigExpirationChecker = null;
  }
  if (this.driverName && config.connection) {
    this.initializeDriver();
    if (!config.pool || (config.pool && config.pool.max !== 0)) {
      this.initializePool(config);
    }
  }
  this.valueForUndefined = this.raw('DEFAULT');
  if (config.useNullAsDefault) {
    this.valueForUndefined = null;
  }
}

inherits(Client, EventEmitter$5);

Object.assign(Client.prototype, {
  formatter(builder) {
    return new formatter(this, builder);
  },

  queryBuilder() {
    return new builder(this);
  },

  queryCompiler(builder) {
    return new compiler(this, builder);
  },

  schemaBuilder() {
    return new builder$1(this);
  },

  schemaCompiler(builder) {
    return new compiler$1(this, builder);
  },

  tableBuilder(type, tableName, fn) {
    return new tablebuilder(this, type, tableName, fn);
  },

  tableCompiler(tableBuilder) {
    return new tablecompiler(this, tableBuilder);
  },

  columnBuilder(tableBuilder, type, args) {
    return new columnbuilder(this, tableBuilder, type, args);
  },

  columnCompiler(tableBuilder, columnBuilder) {
    return new columncompiler(this, tableBuilder, columnBuilder);
  },

  runner(builder) {
    return new runner(this, builder);
  },

  transaction(container, config, outerTx) {
    return new transaction(this, container, config, outerTx);
  },

  raw() {
    return new raw(this).set(...arguments);
  },

  ref() {
    return new ref(this, ...arguments);
  },

  _formatQuery(sql, bindings, timeZone) {
    bindings = bindings == null ? [] : [].concat(bindings);
    let index = 0;
    return sql.replace(/\\?\?/g, (match) => {
      if (match === '\\?') {
        return '?';
      }
      if (index === bindings.length) {
        return match;
      }
      const value = bindings[index++];
      return this._escapeBinding(value, { timeZone });
    });
  },

  _escapeBinding: makeEscape$1({
    escapeString(str) {
      return `'${str.replace(/'/g, "''")}'`;
    },
  }),

  query(connection, obj) {
    if (typeof obj === 'string') obj = { sql: obj };
    obj.bindings = this.prepBindings(obj.bindings);

    const { __knexUid, __knexTxId } = connection;

    this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
    debugQuery(obj.sql, __knexTxId);
    debugBindings$2(obj.bindings, __knexTxId);

    obj.sql = this.positionBindings(obj.sql);

    return this._query(connection, obj).catch((err) => {
      err.message =
        this._formatQuery(obj.sql, obj.bindings) + ' - ' + err.message;
      this.emit(
        'query-error',
        err,
        Object.assign({ __knexUid, __knexTxId }, obj)
      );
      throw err;
    });
  },

  stream(connection, obj, stream, options) {
    if (typeof obj === 'string') obj = { sql: obj };
    obj.bindings = this.prepBindings(obj.bindings);

    const { __knexUid, __knexTxId } = connection;

    this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
    debugQuery(obj.sql, __knexTxId);
    debugBindings$2(obj.bindings, __knexTxId);

    obj.sql = this.positionBindings(obj.sql);

    return this._stream(connection, obj, stream, options);
  },

  prepBindings(bindings) {
    return bindings;
  },

  positionBindings(sql) {
    return sql;
  },

  postProcessResponse(resp, queryContext) {
    if (this.config.postProcessResponse) {
      return this.config.postProcessResponse(resp, queryContext);
    }
    return resp;
  },

  wrapIdentifier(value, queryContext) {
    return this.customWrapIdentifier(
      value,
      this.wrapIdentifierImpl,
      queryContext
    );
  },

  customWrapIdentifier(value, origImpl, queryContext) {
    if (this.config.wrapIdentifier) {
      return this.config.wrapIdentifier(value, origImpl, queryContext);
    }
    return origImpl(value);
  },

  wrapIdentifierImpl(value) {
    return value !== '*' ? `"${value.replace(/"/g, '""')}"` : '*';
  },

  initializeDriver() {
    try {
      this.driver = this._driver();
    } catch (e) {
      const message = `Knex: run\n$ npm install ${this.driverName} --save`;
      this.logger.error(`${message}\n${e.message}\n${e.stack}`);
      throw new Error(`${message}\n${e.message}`);
    }
  },

  poolDefaults() {
    return { min: 2, max: 10, propagateCreateError: true };
  },

  getPoolSettings(poolConfig) {
    poolConfig = defaults({}, poolConfig, this.poolDefaults());

    POOL_CONFIG_OPTIONS$1.forEach((option) => {
      if (option in poolConfig) {
        this.logger.warn(
          [
            `Pool config option "${option}" is no longer supported.`,
            `See https://github.com/Vincit/tarn.js for possible pool config options.`,
          ].join(' ')
        );
      }
    });

    const timeouts = [
      this.config.acquireConnectionTimeout || 60000,
      poolConfig.acquireTimeoutMillis,
    ].filter((timeout) => timeout !== undefined);

    // acquire connection timeout can be set on config or config.pool
    // choose the smallest, positive timeout setting and set on poolConfig
    poolConfig.acquireTimeoutMillis = Math.min(...timeouts);

    const updatePoolConnectionSettingsFromProvider = async () => {
      if (!this.connectionConfigProvider) {
        return; // static configuration, nothing to update
      }
      if (
        !this.connectionConfigExpirationChecker ||
        !this.connectionConfigExpirationChecker()
      ) {
        return; // not expired, reuse existing connection
      }
      const providerResult = await this.connectionConfigProvider();
      if (providerResult.expirationChecker) {
        this.connectionConfigExpirationChecker =
          providerResult.expirationChecker;
        delete providerResult.expirationChecker; // MySQL2 driver warns on receiving extra properties
      } else {
        this.connectionConfigExpirationChecker = null;
      }
      this.connectionSettings = providerResult;
    };

    return Object.assign(poolConfig, {
      create: async () => {
        await updatePoolConnectionSettingsFromProvider();
        const connection = await this.acquireRawConnection();
        connection.__knexUid = uniqueId$1('__knexUid');
        if (poolConfig.afterCreate) {
          await promisify$2(poolConfig.afterCreate)(connection);
        }
        return connection;
      },

      destroy: (connection) => {
        if (connection !== void 0) {
          return this.destroyRawConnection(connection);
        }
      },

      validate: (connection) => {
        if (connection.__knex__disposed) {
          this.logger.warn(`Connection Error: ${connection.__knex__disposed}`);
          return false;
        }

        return this.validateConnection(connection);
      },
    });
  },

  initializePool(config = this.config) {
    if (this.pool) {
      this.logger.warn('The pool has already been initialized');
      return;
    }

    const tarnPoolConfig = {
      ...this.getPoolSettings(config.pool),
    };
    // afterCreate is an internal knex param, tarn.js does not support it
    if (tarnPoolConfig.afterCreate) {
      delete tarnPoolConfig.afterCreate;
    }

    this.pool = new Pool(tarnPoolConfig);
  },

  validateConnection(connection) {
    return true;
  },

  // Acquire a connection from the pool.
  async acquireConnection() {
    if (!this.pool) {
      throw new Error('Unable to acquire a connection');
    }
    try {
      const connection = await this.pool.acquire().promise;
      debug$1('acquired connection from pool: %s', connection.__knexUid);
      return connection;
    } catch (error) {
      let convertedError = error;
      if (error instanceof TimeoutError) {
        convertedError = new KnexTimeoutError$3(
          'Knex: Timeout acquiring a connection. The pool is probably full. ' +
            'Are you missing a .transacting(trx) call?'
        );
      }
      throw convertedError;
    }
  },

  // Releases a connection back to the connection pool,
  // returning a promise resolved when the connection is released.
  releaseConnection(connection) {
    debug$1('releasing connection to pool: %s', connection.__knexUid);
    const didRelease = this.pool.release(connection);

    if (!didRelease) {
      debug$1('pool refused connection: %s', connection.__knexUid);
    }

    return Promise.resolve();
  },

  // Destroy the current connection pool for the client.
  destroy(callback) {
    const maybeDestroy = this.pool && this.pool.destroy();

    return Promise.resolve(maybeDestroy)
      .then(() => {
        this.pool = void 0;

        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch((err) => {
        if (typeof callback === 'function') {
          callback(err);
        }

        return Promise.reject(err);
      });
  },

  // Return the database being used by this client.
  database() {
    return this.connectionSettings.database;
  },

  toString() {
    return '[object KnexClient]';
  },

  canCancelQuery: false,

  assertCanCancelQuery() {
    if (!this.canCancelQuery) {
      throw new Error('Query cancelling not supported for this dialect');
    }
  },

  cancelQuery() {
    throw new Error('Query cancelling not supported for this dialect');
  },
});

var client = Client;

const { parse } = pgConnectionString;
const parsePG = parse;
const isWindows = process && process.platform && process.platform === 'win32';

var parseConnection = function parseConnectionString(str) {
  const parsed = url.parse(str, true);
  let { protocol } = parsed;
  const isDriveLetter = isWindows && protocol && protocol.length === 2;
  if (protocol === null || isDriveLetter) {
    return {
      client: 'sqlite3',
      connection: {
        filename: str,
      },
    };
  }
  if (protocol.slice(-1) === ':') {
    protocol = protocol.slice(0, -1);
  }

  const isPG = ['postgresql', 'postgres'].includes(protocol);

  return {
    client: protocol,
    connection: isPG ? parsePG(str) : connectionObject(parsed),
  };
};

function connectionObject(parsed) {
  const connection = {};
  let db = parsed.pathname;
  if (db[0] === '/') {
    db = db.slice(1);
  }

  connection.database = db;

  if (parsed.hostname) {
    if (parsed.protocol.indexOf('mssql') === 0) {
      connection.server = parsed.hostname;
    } else {
      connection.host = parsed.hostname;
    }
  }
  if (parsed.port) {
    connection.port = parsed.port;
  }
  if (parsed.auth) {
    const idx = parsed.auth.indexOf(':');
    if (idx !== -1) {
      connection.user = parsed.auth.slice(0, idx);
      if (idx < parsed.auth.length - 1) {
        connection.password = parsed.auth.slice(idx + 1);
      }
    } else {
      connection.user = parsed.auth;
    }
  }
  if (parsed.query) {
    for (const key in parsed.query) {
      connection[key] = parsed.query[key];
    }
  }
  return connection;
}

const fakeClient = {
  formatter(builder) {
    return new formatter(fakeClient, builder);
  },
};

var fakeClient_1 = fakeClient;

const { KnexTimeoutError: KnexTimeoutError$4 } = timeout_1;

const { SUPPORTED_CLIENTS: SUPPORTED_CLIENTS$1 } = constants;
const {
  resolveClientNameWithAliases: resolveClientNameWithAliases$1,
} = helpers;

function Knex(config) {
  // If config is a string, try to parse it
  if (typeof config === 'string') {
    const parsedConfig = Object.assign(parseConnection(config), arguments[2]);
    return new Knex(parsedConfig);
  }

  let Dialect;
  // If user provided no relevant parameters, use generic client
  if (arguments.length === 0 || (!config.client && !config.dialect)) {
    Dialect = client;
  }

  // If user provided Client constructor as a parameter, use it
  else if (
    typeof config.client === 'function' &&
    config.client.prototype instanceof client
  ) {
    Dialect = config.client;
  }

  // If neither applies, let's assume user specified name of a client or dialect as a string
  else {
    const clientName = config.client || config.dialect;
    if (!SUPPORTED_CLIENTS$1.includes(clientName)) {
      throw new Error(
        `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
      );
    }

    const resolvedClientName = resolveClientNameWithAliases$1(clientName);
    Dialect = commonjsRequire();
  }

  // If config connection parameter is passed as string, try to parse it
  if (typeof config.connection === 'string') {
    config = Object.assign({}, config, {
      connection: parseConnection(config.connection).connection,
    });
  }
  const newKnex = makeKnex_1(new Dialect(config));
  if (config.userParams) {
    newKnex.userParams = config.userParams;
  }
  return newKnex;
}

// Expose Client on the main Knex namespace.
Knex.Client = client;

Knex.KnexTimeoutError = KnexTimeoutError$4;

Knex.QueryBuilder = {
  extend: function(methodName, fn) {
    builder.extend(methodName, fn);
    methods.push(methodName);
  },
};

/* eslint no-console:0 */

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = (sql, bindings) => {
  console.warn(
    'global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)'
  );
  return new raw(fakeClient_1).set(sql, bindings);
};

var knex = Knex;

var lib = knex;

// Knex.js
// --------------
//     (c) 2013-present Tim Griesser
//     Knex may be freely distributed under the MIT license.
//     For details and documentation:
//     http://knexjs.org

var knex$1 = lib;

export default knex$1;
