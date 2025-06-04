
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Wallet
 * 
 */
export type Wallet = $Result.DefaultSelection<Prisma.$WalletPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model UserRanking
 * 
 */
export type UserRanking = $Result.DefaultSelection<Prisma.$UserRankingPayload>
/**
 * Model GameStats
 * 
 */
export type GameStats = $Result.DefaultSelection<Prisma.$GameStatsPayload>
/**
 * Model RewardClaim
 * 
 */
export type RewardClaim = $Result.DefaultSelection<Prisma.$RewardClaimPayload>
/**
 * Model Jackpot
 * 
 */
export type Jackpot = $Result.DefaultSelection<Prisma.$JackpotPayload>
/**
 * Model Raffle
 * 
 */
export type Raffle = $Result.DefaultSelection<Prisma.$RafflePayload>
/**
 * Model RaffleTicket
 * 
 */
export type RaffleTicket = $Result.DefaultSelection<Prisma.$RaffleTicketPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TransactionType: {
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  CHEST: 'CHEST',
  JACKPOT: 'JACKPOT',
  COINFLIP: 'COINFLIP',
  RAFFLE: 'RAFFLE',
  REWARD: 'REWARD'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const TransactionStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const RewardType: {
  RAKEBACK: 'RAKEBACK',
  MONTHLY_BONUS: 'MONTHLY_BONUS',
  LOSS_COMPENSATION: 'LOSS_COMPENSATION',
  WEEKLY_LOSS_COMPENSATION: 'WEEKLY_LOSS_COMPENSATION'
};

export type RewardType = (typeof RewardType)[keyof typeof RewardType]


export const ClaimStatus: {
  PENDING: 'PENDING',
  CLAIMED: 'CLAIMED',
  EXPIRED: 'EXPIRED'
};

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]

}

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type RewardType = $Enums.RewardType

export const RewardType: typeof $Enums.RewardType

export type ClaimStatus = $Enums.ClaimStatus

export const ClaimStatus: typeof $Enums.ClaimStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Wallets
 * const wallets = await prisma.wallet.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Wallets
   * const wallets = await prisma.wallet.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wallets
    * const wallets = await prisma.wallet.findMany()
    * ```
    */
  get wallet(): Prisma.WalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userRanking`: Exposes CRUD operations for the **UserRanking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserRankings
    * const userRankings = await prisma.userRanking.findMany()
    * ```
    */
  get userRanking(): Prisma.UserRankingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameStats`: Exposes CRUD operations for the **GameStats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameStats
    * const gameStats = await prisma.gameStats.findMany()
    * ```
    */
  get gameStats(): Prisma.GameStatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rewardClaim`: Exposes CRUD operations for the **RewardClaim** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RewardClaims
    * const rewardClaims = await prisma.rewardClaim.findMany()
    * ```
    */
  get rewardClaim(): Prisma.RewardClaimDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jackpot`: Exposes CRUD operations for the **Jackpot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jackpots
    * const jackpots = await prisma.jackpot.findMany()
    * ```
    */
  get jackpot(): Prisma.JackpotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.raffle`: Exposes CRUD operations for the **Raffle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Raffles
    * const raffles = await prisma.raffle.findMany()
    * ```
    */
  get raffle(): Prisma.RaffleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.raffleTicket`: Exposes CRUD operations for the **RaffleTicket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RaffleTickets
    * const raffleTickets = await prisma.raffleTicket.findMany()
    * ```
    */
  get raffleTicket(): Prisma.RaffleTicketDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Wallet: 'Wallet',
    Transaction: 'Transaction',
    UserRanking: 'UserRanking',
    GameStats: 'GameStats',
    RewardClaim: 'RewardClaim',
    Jackpot: 'Jackpot',
    Raffle: 'Raffle',
    RaffleTicket: 'RaffleTicket'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "wallet" | "transaction" | "userRanking" | "gameStats" | "rewardClaim" | "jackpot" | "raffle" | "raffleTicket"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Wallet: {
        payload: Prisma.$WalletPayload<ExtArgs>
        fields: Prisma.WalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findFirst: {
            args: Prisma.WalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findMany: {
            args: Prisma.WalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          create: {
            args: Prisma.WalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          createMany: {
            args: Prisma.WalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WalletCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          delete: {
            args: Prisma.WalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          update: {
            args: Prisma.WalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          deleteMany: {
            args: Prisma.WalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WalletUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          upsert: {
            args: Prisma.WalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          aggregate: {
            args: Prisma.WalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWallet>
          }
          groupBy: {
            args: Prisma.WalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletCountArgs<ExtArgs>
            result: $Utils.Optional<WalletCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      UserRanking: {
        payload: Prisma.$UserRankingPayload<ExtArgs>
        fields: Prisma.UserRankingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserRankingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserRankingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          findFirst: {
            args: Prisma.UserRankingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserRankingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          findMany: {
            args: Prisma.UserRankingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>[]
          }
          create: {
            args: Prisma.UserRankingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          createMany: {
            args: Prisma.UserRankingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserRankingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>[]
          }
          delete: {
            args: Prisma.UserRankingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          update: {
            args: Prisma.UserRankingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          deleteMany: {
            args: Prisma.UserRankingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserRankingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserRankingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>[]
          }
          upsert: {
            args: Prisma.UserRankingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRankingPayload>
          }
          aggregate: {
            args: Prisma.UserRankingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserRanking>
          }
          groupBy: {
            args: Prisma.UserRankingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserRankingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserRankingCountArgs<ExtArgs>
            result: $Utils.Optional<UserRankingCountAggregateOutputType> | number
          }
        }
      }
      GameStats: {
        payload: Prisma.$GameStatsPayload<ExtArgs>
        fields: Prisma.GameStatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameStatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameStatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          findFirst: {
            args: Prisma.GameStatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameStatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          findMany: {
            args: Prisma.GameStatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>[]
          }
          create: {
            args: Prisma.GameStatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          createMany: {
            args: Prisma.GameStatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameStatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>[]
          }
          delete: {
            args: Prisma.GameStatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          update: {
            args: Prisma.GameStatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          deleteMany: {
            args: Prisma.GameStatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameStatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameStatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>[]
          }
          upsert: {
            args: Prisma.GameStatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameStatsPayload>
          }
          aggregate: {
            args: Prisma.GameStatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameStats>
          }
          groupBy: {
            args: Prisma.GameStatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameStatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameStatsCountArgs<ExtArgs>
            result: $Utils.Optional<GameStatsCountAggregateOutputType> | number
          }
        }
      }
      RewardClaim: {
        payload: Prisma.$RewardClaimPayload<ExtArgs>
        fields: Prisma.RewardClaimFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RewardClaimFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RewardClaimFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          findFirst: {
            args: Prisma.RewardClaimFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RewardClaimFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          findMany: {
            args: Prisma.RewardClaimFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>[]
          }
          create: {
            args: Prisma.RewardClaimCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          createMany: {
            args: Prisma.RewardClaimCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RewardClaimCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>[]
          }
          delete: {
            args: Prisma.RewardClaimDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          update: {
            args: Prisma.RewardClaimUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          deleteMany: {
            args: Prisma.RewardClaimDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RewardClaimUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RewardClaimUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>[]
          }
          upsert: {
            args: Prisma.RewardClaimUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RewardClaimPayload>
          }
          aggregate: {
            args: Prisma.RewardClaimAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRewardClaim>
          }
          groupBy: {
            args: Prisma.RewardClaimGroupByArgs<ExtArgs>
            result: $Utils.Optional<RewardClaimGroupByOutputType>[]
          }
          count: {
            args: Prisma.RewardClaimCountArgs<ExtArgs>
            result: $Utils.Optional<RewardClaimCountAggregateOutputType> | number
          }
        }
      }
      Jackpot: {
        payload: Prisma.$JackpotPayload<ExtArgs>
        fields: Prisma.JackpotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JackpotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JackpotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          findFirst: {
            args: Prisma.JackpotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JackpotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          findMany: {
            args: Prisma.JackpotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>[]
          }
          create: {
            args: Prisma.JackpotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          createMany: {
            args: Prisma.JackpotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JackpotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>[]
          }
          delete: {
            args: Prisma.JackpotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          update: {
            args: Prisma.JackpotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          deleteMany: {
            args: Prisma.JackpotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JackpotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JackpotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>[]
          }
          upsert: {
            args: Prisma.JackpotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JackpotPayload>
          }
          aggregate: {
            args: Prisma.JackpotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJackpot>
          }
          groupBy: {
            args: Prisma.JackpotGroupByArgs<ExtArgs>
            result: $Utils.Optional<JackpotGroupByOutputType>[]
          }
          count: {
            args: Prisma.JackpotCountArgs<ExtArgs>
            result: $Utils.Optional<JackpotCountAggregateOutputType> | number
          }
        }
      }
      Raffle: {
        payload: Prisma.$RafflePayload<ExtArgs>
        fields: Prisma.RaffleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RaffleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RaffleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          findFirst: {
            args: Prisma.RaffleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RaffleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          findMany: {
            args: Prisma.RaffleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          create: {
            args: Prisma.RaffleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          createMany: {
            args: Prisma.RaffleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RaffleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          delete: {
            args: Prisma.RaffleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          update: {
            args: Prisma.RaffleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          deleteMany: {
            args: Prisma.RaffleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RaffleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RaffleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          upsert: {
            args: Prisma.RaffleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          aggregate: {
            args: Prisma.RaffleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRaffle>
          }
          groupBy: {
            args: Prisma.RaffleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RaffleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RaffleCountArgs<ExtArgs>
            result: $Utils.Optional<RaffleCountAggregateOutputType> | number
          }
        }
      }
      RaffleTicket: {
        payload: Prisma.$RaffleTicketPayload<ExtArgs>
        fields: Prisma.RaffleTicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RaffleTicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RaffleTicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          findFirst: {
            args: Prisma.RaffleTicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RaffleTicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          findMany: {
            args: Prisma.RaffleTicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>[]
          }
          create: {
            args: Prisma.RaffleTicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          createMany: {
            args: Prisma.RaffleTicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RaffleTicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>[]
          }
          delete: {
            args: Prisma.RaffleTicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          update: {
            args: Prisma.RaffleTicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          deleteMany: {
            args: Prisma.RaffleTicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RaffleTicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RaffleTicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>[]
          }
          upsert: {
            args: Prisma.RaffleTicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleTicketPayload>
          }
          aggregate: {
            args: Prisma.RaffleTicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRaffleTicket>
          }
          groupBy: {
            args: Prisma.RaffleTicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<RaffleTicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.RaffleTicketCountArgs<ExtArgs>
            result: $Utils.Optional<RaffleTicketCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    wallet?: WalletOmit
    transaction?: TransactionOmit
    userRanking?: UserRankingOmit
    gameStats?: GameStatsOmit
    rewardClaim?: RewardClaimOmit
    jackpot?: JackpotOmit
    raffle?: RaffleOmit
    raffleTicket?: RaffleTicketOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WalletCountOutputType
   */

  export type WalletCountOutputType = {
    transactions: number
    rewardClaims: number
    raffleTickets: number
  }

  export type WalletCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | WalletCountOutputTypeCountTransactionsArgs
    rewardClaims?: boolean | WalletCountOutputTypeCountRewardClaimsArgs
    raffleTickets?: boolean | WalletCountOutputTypeCountRaffleTicketsArgs
  }

  // Custom InputTypes
  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletCountOutputType
     */
    select?: WalletCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountRewardClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RewardClaimWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountRaffleTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleTicketWhereInput
  }


  /**
   * Count Type RaffleCountOutputType
   */

  export type RaffleCountOutputType = {
    tickets: number
  }

  export type RaffleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | RaffleCountOutputTypeCountTicketsArgs
  }

  // Custom InputTypes
  /**
   * RaffleCountOutputType without action
   */
  export type RaffleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleCountOutputType
     */
    select?: RaffleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RaffleCountOutputType without action
   */
  export type RaffleCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleTicketWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Wallet
   */

  export type AggregateWallet = {
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  export type WalletAvgAggregateOutputType = {
    balance: number | null
  }

  export type WalletSumAggregateOutputType = {
    balance: number | null
  }

  export type WalletMinAggregateOutputType = {
    id: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMaxAggregateOutputType = {
    id: string | null
    address: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletCountAggregateOutputType = {
    id: number
    address: number
    balance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WalletAvgAggregateInputType = {
    balance?: true
  }

  export type WalletSumAggregateInputType = {
    balance?: true
  }

  export type WalletMinAggregateInputType = {
    id?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletMaxAggregateInputType = {
    id?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletCountAggregateInputType = {
    id?: true
    address?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallet to aggregate.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wallets
    **/
    _count?: true | WalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMaxAggregateInputType
  }

  export type GetWalletAggregateType<T extends WalletAggregateArgs> = {
        [P in keyof T & keyof AggregateWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWallet[P]>
      : GetScalarType<T[P], AggregateWallet[P]>
  }




  export type WalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletWhereInput
    orderBy?: WalletOrderByWithAggregationInput | WalletOrderByWithAggregationInput[]
    by: WalletScalarFieldEnum[] | WalletScalarFieldEnum
    having?: WalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletCountAggregateInputType | true
    _avg?: WalletAvgAggregateInputType
    _sum?: WalletSumAggregateInputType
    _min?: WalletMinAggregateInputType
    _max?: WalletMaxAggregateInputType
  }

  export type WalletGroupByOutputType = {
    id: string
    address: string
    balance: number
    createdAt: Date
    updatedAt: Date
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  type GetWalletGroupByPayload<T extends WalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletGroupByOutputType[P]>
            : GetScalarType<T[P], WalletGroupByOutputType[P]>
        }
      >
    >


  export type WalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactions?: boolean | Wallet$transactionsArgs<ExtArgs>
    userRanking?: boolean | Wallet$userRankingArgs<ExtArgs>
    rewardClaims?: boolean | Wallet$rewardClaimsArgs<ExtArgs>
    raffleTickets?: boolean | Wallet$raffleTicketsArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectScalar = {
    id?: boolean
    address?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "balance" | "createdAt" | "updatedAt", ExtArgs["result"]["wallet"]>
  export type WalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | Wallet$transactionsArgs<ExtArgs>
    userRanking?: boolean | Wallet$userRankingArgs<ExtArgs>
    rewardClaims?: boolean | Wallet$rewardClaimsArgs<ExtArgs>
    raffleTickets?: boolean | Wallet$raffleTicketsArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WalletIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WalletIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wallet"
    objects: {
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      userRanking: Prisma.$UserRankingPayload<ExtArgs> | null
      rewardClaims: Prisma.$RewardClaimPayload<ExtArgs>[]
      raffleTickets: Prisma.$RaffleTicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      balance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["wallet"]>
    composites: {}
  }

  type WalletGetPayload<S extends boolean | null | undefined | WalletDefaultArgs> = $Result.GetResult<Prisma.$WalletPayload, S>

  type WalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletCountAggregateInputType | true
    }

  export interface WalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wallet'], meta: { name: 'Wallet' } }
    /**
     * Find zero or one Wallet that matches the filter.
     * @param {WalletFindUniqueArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletFindUniqueArgs>(args: SelectSubset<T, WalletFindUniqueArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletFindUniqueOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletFindFirstArgs>(args?: SelectSubset<T, WalletFindFirstArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wallets
     * const wallets = await prisma.wallet.findMany()
     * 
     * // Get first 10 Wallets
     * const wallets = await prisma.wallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletWithIdOnly = await prisma.wallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletFindManyArgs>(args?: SelectSubset<T, WalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wallet.
     * @param {WalletCreateArgs} args - Arguments to create a Wallet.
     * @example
     * // Create one Wallet
     * const Wallet = await prisma.wallet.create({
     *   data: {
     *     // ... data to create a Wallet
     *   }
     * })
     * 
     */
    create<T extends WalletCreateArgs>(args: SelectSubset<T, WalletCreateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wallets.
     * @param {WalletCreateManyArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletCreateManyArgs>(args?: SelectSubset<T, WalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wallets and returns the data saved in the database.
     * @param {WalletCreateManyAndReturnArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WalletCreateManyAndReturnArgs>(args?: SelectSubset<T, WalletCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wallet.
     * @param {WalletDeleteArgs} args - Arguments to delete one Wallet.
     * @example
     * // Delete one Wallet
     * const Wallet = await prisma.wallet.delete({
     *   where: {
     *     // ... filter to delete one Wallet
     *   }
     * })
     * 
     */
    delete<T extends WalletDeleteArgs>(args: SelectSubset<T, WalletDeleteArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wallet.
     * @param {WalletUpdateArgs} args - Arguments to update one Wallet.
     * @example
     * // Update one Wallet
     * const wallet = await prisma.wallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletUpdateArgs>(args: SelectSubset<T, WalletUpdateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wallets.
     * @param {WalletDeleteManyArgs} args - Arguments to filter Wallets to delete.
     * @example
     * // Delete a few Wallets
     * const { count } = await prisma.wallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletDeleteManyArgs>(args?: SelectSubset<T, WalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletUpdateManyArgs>(args: SelectSubset<T, WalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets and returns the data updated in the database.
     * @param {WalletUpdateManyAndReturnArgs} args - Arguments to update many Wallets.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WalletUpdateManyAndReturnArgs>(args: SelectSubset<T, WalletUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wallet.
     * @param {WalletUpsertArgs} args - Arguments to update or create a Wallet.
     * @example
     * // Update or create a Wallet
     * const wallet = await prisma.wallet.upsert({
     *   create: {
     *     // ... data to create a Wallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wallet we want to update
     *   }
     * })
     */
    upsert<T extends WalletUpsertArgs>(args: SelectSubset<T, WalletUpsertArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletCountArgs} args - Arguments to filter Wallets to count.
     * @example
     * // Count the number of Wallets
     * const count = await prisma.wallet.count({
     *   where: {
     *     // ... the filter for the Wallets we want to count
     *   }
     * })
    **/
    count<T extends WalletCountArgs>(
      args?: Subset<T, WalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletAggregateArgs>(args: Subset<T, WalletAggregateArgs>): Prisma.PrismaPromise<GetWalletAggregateType<T>>

    /**
     * Group by Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletGroupByArgs['orderBy'] }
        : { orderBy?: WalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wallet model
   */
  readonly fields: WalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends Wallet$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userRanking<T extends Wallet$userRankingArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$userRankingArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    rewardClaims<T extends Wallet$rewardClaimsArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$rewardClaimsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    raffleTickets<T extends Wallet$raffleTicketsArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$raffleTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wallet model
   */
  interface WalletFieldRefs {
    readonly id: FieldRef<"Wallet", 'String'>
    readonly address: FieldRef<"Wallet", 'String'>
    readonly balance: FieldRef<"Wallet", 'Float'>
    readonly createdAt: FieldRef<"Wallet", 'DateTime'>
    readonly updatedAt: FieldRef<"Wallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wallet findUnique
   */
  export type WalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findUniqueOrThrow
   */
  export type WalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findFirst
   */
  export type WalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findFirstOrThrow
   */
  export type WalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findMany
   */
  export type WalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallets to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet create
   */
  export type WalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to create a Wallet.
     */
    data: XOR<WalletCreateInput, WalletUncheckedCreateInput>
  }

  /**
   * Wallet createMany
   */
  export type WalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wallet createManyAndReturn
   */
  export type WalletCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wallet update
   */
  export type WalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to update a Wallet.
     */
    data: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
    /**
     * Choose, which Wallet to update.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet updateMany
   */
  export type WalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet updateManyAndReturn
   */
  export type WalletUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet upsert
   */
  export type WalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The filter to search for the Wallet to update in case it exists.
     */
    where: WalletWhereUniqueInput
    /**
     * In case the Wallet found by the `where` argument doesn't exist, create a new Wallet with this data.
     */
    create: XOR<WalletCreateInput, WalletUncheckedCreateInput>
    /**
     * In case the Wallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
  }

  /**
   * Wallet delete
   */
  export type WalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter which Wallet to delete.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet deleteMany
   */
  export type WalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallets to delete
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to delete.
     */
    limit?: number
  }

  /**
   * Wallet.transactions
   */
  export type Wallet$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Wallet.userRanking
   */
  export type Wallet$userRankingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    where?: UserRankingWhereInput
  }

  /**
   * Wallet.rewardClaims
   */
  export type Wallet$rewardClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    where?: RewardClaimWhereInput
    orderBy?: RewardClaimOrderByWithRelationInput | RewardClaimOrderByWithRelationInput[]
    cursor?: RewardClaimWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RewardClaimScalarFieldEnum | RewardClaimScalarFieldEnum[]
  }

  /**
   * Wallet.raffleTickets
   */
  export type Wallet$raffleTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    where?: RaffleTicketWhereInput
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    cursor?: RaffleTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RaffleTicketScalarFieldEnum | RaffleTicketScalarFieldEnum[]
  }

  /**
   * Wallet without action
   */
  export type WalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    type: $Enums.TransactionType | null
    amount: number | null
    status: $Enums.TransactionStatus | null
    paymentHash: string | null
    walletId: string | null
    createdAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    type: $Enums.TransactionType | null
    amount: number | null
    status: $Enums.TransactionStatus | null
    paymentHash: string | null
    walletId: string | null
    createdAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    type: number
    amount: number
    status: number
    paymentHash: number
    walletId: number
    createdAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    type?: true
    amount?: true
    status?: true
    paymentHash?: true
    walletId?: true
    createdAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    type?: true
    amount?: true
    status?: true
    paymentHash?: true
    walletId?: true
    createdAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    type?: true
    amount?: true
    status?: true
    paymentHash?: true
    walletId?: true
    createdAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    type: $Enums.TransactionType
    amount: number
    status: $Enums.TransactionStatus
    paymentHash: string | null
    walletId: string
    createdAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    paymentHash?: boolean
    walletId?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    paymentHash?: boolean
    walletId?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    paymentHash?: boolean
    walletId?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    paymentHash?: boolean
    walletId?: boolean
    createdAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "amount" | "status" | "paymentHash" | "walletId" | "createdAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.TransactionType
      amount: number
      status: $Enums.TransactionStatus
      paymentHash: string | null
      walletId: string
      createdAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'TransactionType'>
    readonly amount: FieldRef<"Transaction", 'Float'>
    readonly status: FieldRef<"Transaction", 'TransactionStatus'>
    readonly paymentHash: FieldRef<"Transaction", 'String'>
    readonly walletId: FieldRef<"Transaction", 'String'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model UserRanking
   */

  export type AggregateUserRanking = {
    _count: UserRankingCountAggregateOutputType | null
    _avg: UserRankingAvgAggregateOutputType | null
    _sum: UserRankingSumAggregateOutputType | null
    _min: UserRankingMinAggregateOutputType | null
    _max: UserRankingMaxAggregateOutputType | null
  }

  export type UserRankingAvgAggregateOutputType = {
    totalWagered: number | null
    rankProgress: number | null
    dailyWager: number | null
    weeklyWager: number | null
    monthlyWager: number | null
  }

  export type UserRankingSumAggregateOutputType = {
    totalWagered: number | null
    rankProgress: number | null
    dailyWager: number | null
    weeklyWager: number | null
    monthlyWager: number | null
  }

  export type UserRankingMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    totalWagered: number | null
    currentRank: string | null
    rankProgress: number | null
    dailyWager: number | null
    weeklyWager: number | null
    monthlyWager: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type UserRankingMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    totalWagered: number | null
    currentRank: string | null
    rankProgress: number | null
    dailyWager: number | null
    weeklyWager: number | null
    monthlyWager: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type UserRankingCountAggregateOutputType = {
    id: number
    walletId: number
    totalWagered: number
    currentRank: number
    rankProgress: number
    dailyWager: number
    weeklyWager: number
    monthlyWager: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type UserRankingAvgAggregateInputType = {
    totalWagered?: true
    rankProgress?: true
    dailyWager?: true
    weeklyWager?: true
    monthlyWager?: true
  }

  export type UserRankingSumAggregateInputType = {
    totalWagered?: true
    rankProgress?: true
    dailyWager?: true
    weeklyWager?: true
    monthlyWager?: true
  }

  export type UserRankingMinAggregateInputType = {
    id?: true
    walletId?: true
    totalWagered?: true
    currentRank?: true
    rankProgress?: true
    dailyWager?: true
    weeklyWager?: true
    monthlyWager?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type UserRankingMaxAggregateInputType = {
    id?: true
    walletId?: true
    totalWagered?: true
    currentRank?: true
    rankProgress?: true
    dailyWager?: true
    weeklyWager?: true
    monthlyWager?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type UserRankingCountAggregateInputType = {
    id?: true
    walletId?: true
    totalWagered?: true
    currentRank?: true
    rankProgress?: true
    dailyWager?: true
    weeklyWager?: true
    monthlyWager?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type UserRankingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRanking to aggregate.
     */
    where?: UserRankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRankings to fetch.
     */
    orderBy?: UserRankingOrderByWithRelationInput | UserRankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserRankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserRankings
    **/
    _count?: true | UserRankingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserRankingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserRankingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserRankingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserRankingMaxAggregateInputType
  }

  export type GetUserRankingAggregateType<T extends UserRankingAggregateArgs> = {
        [P in keyof T & keyof AggregateUserRanking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserRanking[P]>
      : GetScalarType<T[P], AggregateUserRanking[P]>
  }




  export type UserRankingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRankingWhereInput
    orderBy?: UserRankingOrderByWithAggregationInput | UserRankingOrderByWithAggregationInput[]
    by: UserRankingScalarFieldEnum[] | UserRankingScalarFieldEnum
    having?: UserRankingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserRankingCountAggregateInputType | true
    _avg?: UserRankingAvgAggregateInputType
    _sum?: UserRankingSumAggregateInputType
    _min?: UserRankingMinAggregateInputType
    _max?: UserRankingMaxAggregateInputType
  }

  export type UserRankingGroupByOutputType = {
    id: string
    walletId: string
    totalWagered: number
    currentRank: string
    rankProgress: number
    dailyWager: number
    weeklyWager: number
    monthlyWager: number
    lastUpdated: Date
    createdAt: Date
    _count: UserRankingCountAggregateOutputType | null
    _avg: UserRankingAvgAggregateOutputType | null
    _sum: UserRankingSumAggregateOutputType | null
    _min: UserRankingMinAggregateOutputType | null
    _max: UserRankingMaxAggregateOutputType | null
  }

  type GetUserRankingGroupByPayload<T extends UserRankingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserRankingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserRankingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserRankingGroupByOutputType[P]>
            : GetScalarType<T[P], UserRankingGroupByOutputType[P]>
        }
      >
    >


  export type UserRankingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    totalWagered?: boolean
    currentRank?: boolean
    rankProgress?: boolean
    dailyWager?: boolean
    weeklyWager?: boolean
    monthlyWager?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    gameStats?: boolean | UserRanking$gameStatsArgs<ExtArgs>
  }, ExtArgs["result"]["userRanking"]>

  export type UserRankingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    totalWagered?: boolean
    currentRank?: boolean
    rankProgress?: boolean
    dailyWager?: boolean
    weeklyWager?: boolean
    monthlyWager?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRanking"]>

  export type UserRankingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    totalWagered?: boolean
    currentRank?: boolean
    rankProgress?: boolean
    dailyWager?: boolean
    weeklyWager?: boolean
    monthlyWager?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRanking"]>

  export type UserRankingSelectScalar = {
    id?: boolean
    walletId?: boolean
    totalWagered?: boolean
    currentRank?: boolean
    rankProgress?: boolean
    dailyWager?: boolean
    weeklyWager?: boolean
    monthlyWager?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }

  export type UserRankingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "totalWagered" | "currentRank" | "rankProgress" | "dailyWager" | "weeklyWager" | "monthlyWager" | "lastUpdated" | "createdAt", ExtArgs["result"]["userRanking"]>
  export type UserRankingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    gameStats?: boolean | UserRanking$gameStatsArgs<ExtArgs>
  }
  export type UserRankingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type UserRankingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }

  export type $UserRankingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserRanking"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
      gameStats: Prisma.$GameStatsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      totalWagered: number
      currentRank: string
      rankProgress: number
      dailyWager: number
      weeklyWager: number
      monthlyWager: number
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["userRanking"]>
    composites: {}
  }

  type UserRankingGetPayload<S extends boolean | null | undefined | UserRankingDefaultArgs> = $Result.GetResult<Prisma.$UserRankingPayload, S>

  type UserRankingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserRankingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserRankingCountAggregateInputType | true
    }

  export interface UserRankingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserRanking'], meta: { name: 'UserRanking' } }
    /**
     * Find zero or one UserRanking that matches the filter.
     * @param {UserRankingFindUniqueArgs} args - Arguments to find a UserRanking
     * @example
     * // Get one UserRanking
     * const userRanking = await prisma.userRanking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserRankingFindUniqueArgs>(args: SelectSubset<T, UserRankingFindUniqueArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserRanking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserRankingFindUniqueOrThrowArgs} args - Arguments to find a UserRanking
     * @example
     * // Get one UserRanking
     * const userRanking = await prisma.userRanking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserRankingFindUniqueOrThrowArgs>(args: SelectSubset<T, UserRankingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRanking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingFindFirstArgs} args - Arguments to find a UserRanking
     * @example
     * // Get one UserRanking
     * const userRanking = await prisma.userRanking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserRankingFindFirstArgs>(args?: SelectSubset<T, UserRankingFindFirstArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRanking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingFindFirstOrThrowArgs} args - Arguments to find a UserRanking
     * @example
     * // Get one UserRanking
     * const userRanking = await prisma.userRanking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserRankingFindFirstOrThrowArgs>(args?: SelectSubset<T, UserRankingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserRankings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRankings
     * const userRankings = await prisma.userRanking.findMany()
     * 
     * // Get first 10 UserRankings
     * const userRankings = await prisma.userRanking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userRankingWithIdOnly = await prisma.userRanking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserRankingFindManyArgs>(args?: SelectSubset<T, UserRankingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserRanking.
     * @param {UserRankingCreateArgs} args - Arguments to create a UserRanking.
     * @example
     * // Create one UserRanking
     * const UserRanking = await prisma.userRanking.create({
     *   data: {
     *     // ... data to create a UserRanking
     *   }
     * })
     * 
     */
    create<T extends UserRankingCreateArgs>(args: SelectSubset<T, UserRankingCreateArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserRankings.
     * @param {UserRankingCreateManyArgs} args - Arguments to create many UserRankings.
     * @example
     * // Create many UserRankings
     * const userRanking = await prisma.userRanking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserRankingCreateManyArgs>(args?: SelectSubset<T, UserRankingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserRankings and returns the data saved in the database.
     * @param {UserRankingCreateManyAndReturnArgs} args - Arguments to create many UserRankings.
     * @example
     * // Create many UserRankings
     * const userRanking = await prisma.userRanking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserRankings and only return the `id`
     * const userRankingWithIdOnly = await prisma.userRanking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserRankingCreateManyAndReturnArgs>(args?: SelectSubset<T, UserRankingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserRanking.
     * @param {UserRankingDeleteArgs} args - Arguments to delete one UserRanking.
     * @example
     * // Delete one UserRanking
     * const UserRanking = await prisma.userRanking.delete({
     *   where: {
     *     // ... filter to delete one UserRanking
     *   }
     * })
     * 
     */
    delete<T extends UserRankingDeleteArgs>(args: SelectSubset<T, UserRankingDeleteArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserRanking.
     * @param {UserRankingUpdateArgs} args - Arguments to update one UserRanking.
     * @example
     * // Update one UserRanking
     * const userRanking = await prisma.userRanking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserRankingUpdateArgs>(args: SelectSubset<T, UserRankingUpdateArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserRankings.
     * @param {UserRankingDeleteManyArgs} args - Arguments to filter UserRankings to delete.
     * @example
     * // Delete a few UserRankings
     * const { count } = await prisma.userRanking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserRankingDeleteManyArgs>(args?: SelectSubset<T, UserRankingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRankings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRankings
     * const userRanking = await prisma.userRanking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserRankingUpdateManyArgs>(args: SelectSubset<T, UserRankingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRankings and returns the data updated in the database.
     * @param {UserRankingUpdateManyAndReturnArgs} args - Arguments to update many UserRankings.
     * @example
     * // Update many UserRankings
     * const userRanking = await prisma.userRanking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserRankings and only return the `id`
     * const userRankingWithIdOnly = await prisma.userRanking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserRankingUpdateManyAndReturnArgs>(args: SelectSubset<T, UserRankingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserRanking.
     * @param {UserRankingUpsertArgs} args - Arguments to update or create a UserRanking.
     * @example
     * // Update or create a UserRanking
     * const userRanking = await prisma.userRanking.upsert({
     *   create: {
     *     // ... data to create a UserRanking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRanking we want to update
     *   }
     * })
     */
    upsert<T extends UserRankingUpsertArgs>(args: SelectSubset<T, UserRankingUpsertArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserRankings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingCountArgs} args - Arguments to filter UserRankings to count.
     * @example
     * // Count the number of UserRankings
     * const count = await prisma.userRanking.count({
     *   where: {
     *     // ... the filter for the UserRankings we want to count
     *   }
     * })
    **/
    count<T extends UserRankingCountArgs>(
      args?: Subset<T, UserRankingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserRankingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserRanking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserRankingAggregateArgs>(args: Subset<T, UserRankingAggregateArgs>): Prisma.PrismaPromise<GetUserRankingAggregateType<T>>

    /**
     * Group by UserRanking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRankingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserRankingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserRankingGroupByArgs['orderBy'] }
        : { orderBy?: UserRankingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserRankingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRankingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserRanking model
   */
  readonly fields: UserRankingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserRanking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserRankingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    gameStats<T extends UserRanking$gameStatsArgs<ExtArgs> = {}>(args?: Subset<T, UserRanking$gameStatsArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserRanking model
   */
  interface UserRankingFieldRefs {
    readonly id: FieldRef<"UserRanking", 'String'>
    readonly walletId: FieldRef<"UserRanking", 'String'>
    readonly totalWagered: FieldRef<"UserRanking", 'Float'>
    readonly currentRank: FieldRef<"UserRanking", 'String'>
    readonly rankProgress: FieldRef<"UserRanking", 'Int'>
    readonly dailyWager: FieldRef<"UserRanking", 'Float'>
    readonly weeklyWager: FieldRef<"UserRanking", 'Float'>
    readonly monthlyWager: FieldRef<"UserRanking", 'Float'>
    readonly lastUpdated: FieldRef<"UserRanking", 'DateTime'>
    readonly createdAt: FieldRef<"UserRanking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserRanking findUnique
   */
  export type UserRankingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter, which UserRanking to fetch.
     */
    where: UserRankingWhereUniqueInput
  }

  /**
   * UserRanking findUniqueOrThrow
   */
  export type UserRankingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter, which UserRanking to fetch.
     */
    where: UserRankingWhereUniqueInput
  }

  /**
   * UserRanking findFirst
   */
  export type UserRankingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter, which UserRanking to fetch.
     */
    where?: UserRankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRankings to fetch.
     */
    orderBy?: UserRankingOrderByWithRelationInput | UserRankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRankings.
     */
    cursor?: UserRankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRankings.
     */
    distinct?: UserRankingScalarFieldEnum | UserRankingScalarFieldEnum[]
  }

  /**
   * UserRanking findFirstOrThrow
   */
  export type UserRankingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter, which UserRanking to fetch.
     */
    where?: UserRankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRankings to fetch.
     */
    orderBy?: UserRankingOrderByWithRelationInput | UserRankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRankings.
     */
    cursor?: UserRankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRankings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRankings.
     */
    distinct?: UserRankingScalarFieldEnum | UserRankingScalarFieldEnum[]
  }

  /**
   * UserRanking findMany
   */
  export type UserRankingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter, which UserRankings to fetch.
     */
    where?: UserRankingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRankings to fetch.
     */
    orderBy?: UserRankingOrderByWithRelationInput | UserRankingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserRankings.
     */
    cursor?: UserRankingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRankings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRankings.
     */
    skip?: number
    distinct?: UserRankingScalarFieldEnum | UserRankingScalarFieldEnum[]
  }

  /**
   * UserRanking create
   */
  export type UserRankingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * The data needed to create a UserRanking.
     */
    data: XOR<UserRankingCreateInput, UserRankingUncheckedCreateInput>
  }

  /**
   * UserRanking createMany
   */
  export type UserRankingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserRankings.
     */
    data: UserRankingCreateManyInput | UserRankingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserRanking createManyAndReturn
   */
  export type UserRankingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * The data used to create many UserRankings.
     */
    data: UserRankingCreateManyInput | UserRankingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRanking update
   */
  export type UserRankingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * The data needed to update a UserRanking.
     */
    data: XOR<UserRankingUpdateInput, UserRankingUncheckedUpdateInput>
    /**
     * Choose, which UserRanking to update.
     */
    where: UserRankingWhereUniqueInput
  }

  /**
   * UserRanking updateMany
   */
  export type UserRankingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserRankings.
     */
    data: XOR<UserRankingUpdateManyMutationInput, UserRankingUncheckedUpdateManyInput>
    /**
     * Filter which UserRankings to update
     */
    where?: UserRankingWhereInput
    /**
     * Limit how many UserRankings to update.
     */
    limit?: number
  }

  /**
   * UserRanking updateManyAndReturn
   */
  export type UserRankingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * The data used to update UserRankings.
     */
    data: XOR<UserRankingUpdateManyMutationInput, UserRankingUncheckedUpdateManyInput>
    /**
     * Filter which UserRankings to update
     */
    where?: UserRankingWhereInput
    /**
     * Limit how many UserRankings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRanking upsert
   */
  export type UserRankingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * The filter to search for the UserRanking to update in case it exists.
     */
    where: UserRankingWhereUniqueInput
    /**
     * In case the UserRanking found by the `where` argument doesn't exist, create a new UserRanking with this data.
     */
    create: XOR<UserRankingCreateInput, UserRankingUncheckedCreateInput>
    /**
     * In case the UserRanking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserRankingUpdateInput, UserRankingUncheckedUpdateInput>
  }

  /**
   * UserRanking delete
   */
  export type UserRankingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
    /**
     * Filter which UserRanking to delete.
     */
    where: UserRankingWhereUniqueInput
  }

  /**
   * UserRanking deleteMany
   */
  export type UserRankingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRankings to delete
     */
    where?: UserRankingWhereInput
    /**
     * Limit how many UserRankings to delete.
     */
    limit?: number
  }

  /**
   * UserRanking.gameStats
   */
  export type UserRanking$gameStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    where?: GameStatsWhereInput
  }

  /**
   * UserRanking without action
   */
  export type UserRankingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRanking
     */
    select?: UserRankingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRanking
     */
    omit?: UserRankingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRankingInclude<ExtArgs> | null
  }


  /**
   * Model GameStats
   */

  export type AggregateGameStats = {
    _count: GameStatsCountAggregateOutputType | null
    _avg: GameStatsAvgAggregateOutputType | null
    _sum: GameStatsSumAggregateOutputType | null
    _min: GameStatsMinAggregateOutputType | null
    _max: GameStatsMaxAggregateOutputType | null
  }

  export type GameStatsAvgAggregateOutputType = {
    chestsPlayed: number | null
    chestsWon: number | null
    chestsWagered: number | null
    coinflipPlayed: number | null
    coinflipWon: number | null
    coinflipWagered: number | null
    rafflesEntered: number | null
    rafflesWon: number | null
    rafflesWagered: number | null
  }

  export type GameStatsSumAggregateOutputType = {
    chestsPlayed: number | null
    chestsWon: number | null
    chestsWagered: number | null
    coinflipPlayed: number | null
    coinflipWon: number | null
    coinflipWagered: number | null
    rafflesEntered: number | null
    rafflesWon: number | null
    rafflesWagered: number | null
  }

  export type GameStatsMinAggregateOutputType = {
    id: string | null
    userRankingId: string | null
    chestsPlayed: number | null
    chestsWon: number | null
    chestsWagered: number | null
    coinflipPlayed: number | null
    coinflipWon: number | null
    coinflipWagered: number | null
    rafflesEntered: number | null
    rafflesWon: number | null
    rafflesWagered: number | null
    lastUpdated: Date | null
  }

  export type GameStatsMaxAggregateOutputType = {
    id: string | null
    userRankingId: string | null
    chestsPlayed: number | null
    chestsWon: number | null
    chestsWagered: number | null
    coinflipPlayed: number | null
    coinflipWon: number | null
    coinflipWagered: number | null
    rafflesEntered: number | null
    rafflesWon: number | null
    rafflesWagered: number | null
    lastUpdated: Date | null
  }

  export type GameStatsCountAggregateOutputType = {
    id: number
    userRankingId: number
    chestsPlayed: number
    chestsWon: number
    chestsWagered: number
    coinflipPlayed: number
    coinflipWon: number
    coinflipWagered: number
    rafflesEntered: number
    rafflesWon: number
    rafflesWagered: number
    lastUpdated: number
    _all: number
  }


  export type GameStatsAvgAggregateInputType = {
    chestsPlayed?: true
    chestsWon?: true
    chestsWagered?: true
    coinflipPlayed?: true
    coinflipWon?: true
    coinflipWagered?: true
    rafflesEntered?: true
    rafflesWon?: true
    rafflesWagered?: true
  }

  export type GameStatsSumAggregateInputType = {
    chestsPlayed?: true
    chestsWon?: true
    chestsWagered?: true
    coinflipPlayed?: true
    coinflipWon?: true
    coinflipWagered?: true
    rafflesEntered?: true
    rafflesWon?: true
    rafflesWagered?: true
  }

  export type GameStatsMinAggregateInputType = {
    id?: true
    userRankingId?: true
    chestsPlayed?: true
    chestsWon?: true
    chestsWagered?: true
    coinflipPlayed?: true
    coinflipWon?: true
    coinflipWagered?: true
    rafflesEntered?: true
    rafflesWon?: true
    rafflesWagered?: true
    lastUpdated?: true
  }

  export type GameStatsMaxAggregateInputType = {
    id?: true
    userRankingId?: true
    chestsPlayed?: true
    chestsWon?: true
    chestsWagered?: true
    coinflipPlayed?: true
    coinflipWon?: true
    coinflipWagered?: true
    rafflesEntered?: true
    rafflesWon?: true
    rafflesWagered?: true
    lastUpdated?: true
  }

  export type GameStatsCountAggregateInputType = {
    id?: true
    userRankingId?: true
    chestsPlayed?: true
    chestsWon?: true
    chestsWagered?: true
    coinflipPlayed?: true
    coinflipWon?: true
    coinflipWagered?: true
    rafflesEntered?: true
    rafflesWon?: true
    rafflesWagered?: true
    lastUpdated?: true
    _all?: true
  }

  export type GameStatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameStats to aggregate.
     */
    where?: GameStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameStats to fetch.
     */
    orderBy?: GameStatsOrderByWithRelationInput | GameStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameStats
    **/
    _count?: true | GameStatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameStatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameStatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameStatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameStatsMaxAggregateInputType
  }

  export type GetGameStatsAggregateType<T extends GameStatsAggregateArgs> = {
        [P in keyof T & keyof AggregateGameStats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameStats[P]>
      : GetScalarType<T[P], AggregateGameStats[P]>
  }




  export type GameStatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameStatsWhereInput
    orderBy?: GameStatsOrderByWithAggregationInput | GameStatsOrderByWithAggregationInput[]
    by: GameStatsScalarFieldEnum[] | GameStatsScalarFieldEnum
    having?: GameStatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameStatsCountAggregateInputType | true
    _avg?: GameStatsAvgAggregateInputType
    _sum?: GameStatsSumAggregateInputType
    _min?: GameStatsMinAggregateInputType
    _max?: GameStatsMaxAggregateInputType
  }

  export type GameStatsGroupByOutputType = {
    id: string
    userRankingId: string
    chestsPlayed: number
    chestsWon: number
    chestsWagered: number
    coinflipPlayed: number
    coinflipWon: number
    coinflipWagered: number
    rafflesEntered: number
    rafflesWon: number
    rafflesWagered: number
    lastUpdated: Date
    _count: GameStatsCountAggregateOutputType | null
    _avg: GameStatsAvgAggregateOutputType | null
    _sum: GameStatsSumAggregateOutputType | null
    _min: GameStatsMinAggregateOutputType | null
    _max: GameStatsMaxAggregateOutputType | null
  }

  type GetGameStatsGroupByPayload<T extends GameStatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameStatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameStatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameStatsGroupByOutputType[P]>
            : GetScalarType<T[P], GameStatsGroupByOutputType[P]>
        }
      >
    >


  export type GameStatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userRankingId?: boolean
    chestsPlayed?: boolean
    chestsWon?: boolean
    chestsWagered?: boolean
    coinflipPlayed?: boolean
    coinflipWon?: boolean
    coinflipWagered?: boolean
    rafflesEntered?: boolean
    rafflesWon?: boolean
    rafflesWagered?: boolean
    lastUpdated?: boolean
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameStats"]>

  export type GameStatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userRankingId?: boolean
    chestsPlayed?: boolean
    chestsWon?: boolean
    chestsWagered?: boolean
    coinflipPlayed?: boolean
    coinflipWon?: boolean
    coinflipWagered?: boolean
    rafflesEntered?: boolean
    rafflesWon?: boolean
    rafflesWagered?: boolean
    lastUpdated?: boolean
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameStats"]>

  export type GameStatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userRankingId?: boolean
    chestsPlayed?: boolean
    chestsWon?: boolean
    chestsWagered?: boolean
    coinflipPlayed?: boolean
    coinflipWon?: boolean
    coinflipWagered?: boolean
    rafflesEntered?: boolean
    rafflesWon?: boolean
    rafflesWagered?: boolean
    lastUpdated?: boolean
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameStats"]>

  export type GameStatsSelectScalar = {
    id?: boolean
    userRankingId?: boolean
    chestsPlayed?: boolean
    chestsWon?: boolean
    chestsWagered?: boolean
    coinflipPlayed?: boolean
    coinflipWon?: boolean
    coinflipWagered?: boolean
    rafflesEntered?: boolean
    rafflesWon?: boolean
    rafflesWagered?: boolean
    lastUpdated?: boolean
  }

  export type GameStatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userRankingId" | "chestsPlayed" | "chestsWon" | "chestsWagered" | "coinflipPlayed" | "coinflipWon" | "coinflipWagered" | "rafflesEntered" | "rafflesWon" | "rafflesWagered" | "lastUpdated", ExtArgs["result"]["gameStats"]>
  export type GameStatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }
  export type GameStatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }
  export type GameStatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRanking?: boolean | UserRankingDefaultArgs<ExtArgs>
  }

  export type $GameStatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameStats"
    objects: {
      userRanking: Prisma.$UserRankingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userRankingId: string
      chestsPlayed: number
      chestsWon: number
      chestsWagered: number
      coinflipPlayed: number
      coinflipWon: number
      coinflipWagered: number
      rafflesEntered: number
      rafflesWon: number
      rafflesWagered: number
      lastUpdated: Date
    }, ExtArgs["result"]["gameStats"]>
    composites: {}
  }

  type GameStatsGetPayload<S extends boolean | null | undefined | GameStatsDefaultArgs> = $Result.GetResult<Prisma.$GameStatsPayload, S>

  type GameStatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameStatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameStatsCountAggregateInputType | true
    }

  export interface GameStatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameStats'], meta: { name: 'GameStats' } }
    /**
     * Find zero or one GameStats that matches the filter.
     * @param {GameStatsFindUniqueArgs} args - Arguments to find a GameStats
     * @example
     * // Get one GameStats
     * const gameStats = await prisma.gameStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameStatsFindUniqueArgs>(args: SelectSubset<T, GameStatsFindUniqueArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameStats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameStatsFindUniqueOrThrowArgs} args - Arguments to find a GameStats
     * @example
     * // Get one GameStats
     * const gameStats = await prisma.gameStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameStatsFindUniqueOrThrowArgs>(args: SelectSubset<T, GameStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsFindFirstArgs} args - Arguments to find a GameStats
     * @example
     * // Get one GameStats
     * const gameStats = await prisma.gameStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameStatsFindFirstArgs>(args?: SelectSubset<T, GameStatsFindFirstArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsFindFirstOrThrowArgs} args - Arguments to find a GameStats
     * @example
     * // Get one GameStats
     * const gameStats = await prisma.gameStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameStatsFindFirstOrThrowArgs>(args?: SelectSubset<T, GameStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameStats
     * const gameStats = await prisma.gameStats.findMany()
     * 
     * // Get first 10 GameStats
     * const gameStats = await prisma.gameStats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameStatsWithIdOnly = await prisma.gameStats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameStatsFindManyArgs>(args?: SelectSubset<T, GameStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameStats.
     * @param {GameStatsCreateArgs} args - Arguments to create a GameStats.
     * @example
     * // Create one GameStats
     * const GameStats = await prisma.gameStats.create({
     *   data: {
     *     // ... data to create a GameStats
     *   }
     * })
     * 
     */
    create<T extends GameStatsCreateArgs>(args: SelectSubset<T, GameStatsCreateArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameStats.
     * @param {GameStatsCreateManyArgs} args - Arguments to create many GameStats.
     * @example
     * // Create many GameStats
     * const gameStats = await prisma.gameStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameStatsCreateManyArgs>(args?: SelectSubset<T, GameStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameStats and returns the data saved in the database.
     * @param {GameStatsCreateManyAndReturnArgs} args - Arguments to create many GameStats.
     * @example
     * // Create many GameStats
     * const gameStats = await prisma.gameStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameStats and only return the `id`
     * const gameStatsWithIdOnly = await prisma.gameStats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameStatsCreateManyAndReturnArgs>(args?: SelectSubset<T, GameStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameStats.
     * @param {GameStatsDeleteArgs} args - Arguments to delete one GameStats.
     * @example
     * // Delete one GameStats
     * const GameStats = await prisma.gameStats.delete({
     *   where: {
     *     // ... filter to delete one GameStats
     *   }
     * })
     * 
     */
    delete<T extends GameStatsDeleteArgs>(args: SelectSubset<T, GameStatsDeleteArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameStats.
     * @param {GameStatsUpdateArgs} args - Arguments to update one GameStats.
     * @example
     * // Update one GameStats
     * const gameStats = await prisma.gameStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameStatsUpdateArgs>(args: SelectSubset<T, GameStatsUpdateArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameStats.
     * @param {GameStatsDeleteManyArgs} args - Arguments to filter GameStats to delete.
     * @example
     * // Delete a few GameStats
     * const { count } = await prisma.gameStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameStatsDeleteManyArgs>(args?: SelectSubset<T, GameStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameStats
     * const gameStats = await prisma.gameStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameStatsUpdateManyArgs>(args: SelectSubset<T, GameStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameStats and returns the data updated in the database.
     * @param {GameStatsUpdateManyAndReturnArgs} args - Arguments to update many GameStats.
     * @example
     * // Update many GameStats
     * const gameStats = await prisma.gameStats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameStats and only return the `id`
     * const gameStatsWithIdOnly = await prisma.gameStats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameStatsUpdateManyAndReturnArgs>(args: SelectSubset<T, GameStatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameStats.
     * @param {GameStatsUpsertArgs} args - Arguments to update or create a GameStats.
     * @example
     * // Update or create a GameStats
     * const gameStats = await prisma.gameStats.upsert({
     *   create: {
     *     // ... data to create a GameStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameStats we want to update
     *   }
     * })
     */
    upsert<T extends GameStatsUpsertArgs>(args: SelectSubset<T, GameStatsUpsertArgs<ExtArgs>>): Prisma__GameStatsClient<$Result.GetResult<Prisma.$GameStatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsCountArgs} args - Arguments to filter GameStats to count.
     * @example
     * // Count the number of GameStats
     * const count = await prisma.gameStats.count({
     *   where: {
     *     // ... the filter for the GameStats we want to count
     *   }
     * })
    **/
    count<T extends GameStatsCountArgs>(
      args?: Subset<T, GameStatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameStatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameStatsAggregateArgs>(args: Subset<T, GameStatsAggregateArgs>): Prisma.PrismaPromise<GetGameStatsAggregateType<T>>

    /**
     * Group by GameStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameStatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameStatsGroupByArgs['orderBy'] }
        : { orderBy?: GameStatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameStats model
   */
  readonly fields: GameStatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameStats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameStatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userRanking<T extends UserRankingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserRankingDefaultArgs<ExtArgs>>): Prisma__UserRankingClient<$Result.GetResult<Prisma.$UserRankingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameStats model
   */
  interface GameStatsFieldRefs {
    readonly id: FieldRef<"GameStats", 'String'>
    readonly userRankingId: FieldRef<"GameStats", 'String'>
    readonly chestsPlayed: FieldRef<"GameStats", 'Int'>
    readonly chestsWon: FieldRef<"GameStats", 'Int'>
    readonly chestsWagered: FieldRef<"GameStats", 'Float'>
    readonly coinflipPlayed: FieldRef<"GameStats", 'Int'>
    readonly coinflipWon: FieldRef<"GameStats", 'Int'>
    readonly coinflipWagered: FieldRef<"GameStats", 'Float'>
    readonly rafflesEntered: FieldRef<"GameStats", 'Int'>
    readonly rafflesWon: FieldRef<"GameStats", 'Int'>
    readonly rafflesWagered: FieldRef<"GameStats", 'Float'>
    readonly lastUpdated: FieldRef<"GameStats", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameStats findUnique
   */
  export type GameStatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter, which GameStats to fetch.
     */
    where: GameStatsWhereUniqueInput
  }

  /**
   * GameStats findUniqueOrThrow
   */
  export type GameStatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter, which GameStats to fetch.
     */
    where: GameStatsWhereUniqueInput
  }

  /**
   * GameStats findFirst
   */
  export type GameStatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter, which GameStats to fetch.
     */
    where?: GameStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameStats to fetch.
     */
    orderBy?: GameStatsOrderByWithRelationInput | GameStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameStats.
     */
    cursor?: GameStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameStats.
     */
    distinct?: GameStatsScalarFieldEnum | GameStatsScalarFieldEnum[]
  }

  /**
   * GameStats findFirstOrThrow
   */
  export type GameStatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter, which GameStats to fetch.
     */
    where?: GameStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameStats to fetch.
     */
    orderBy?: GameStatsOrderByWithRelationInput | GameStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameStats.
     */
    cursor?: GameStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameStats.
     */
    distinct?: GameStatsScalarFieldEnum | GameStatsScalarFieldEnum[]
  }

  /**
   * GameStats findMany
   */
  export type GameStatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter, which GameStats to fetch.
     */
    where?: GameStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameStats to fetch.
     */
    orderBy?: GameStatsOrderByWithRelationInput | GameStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameStats.
     */
    cursor?: GameStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameStats.
     */
    skip?: number
    distinct?: GameStatsScalarFieldEnum | GameStatsScalarFieldEnum[]
  }

  /**
   * GameStats create
   */
  export type GameStatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * The data needed to create a GameStats.
     */
    data: XOR<GameStatsCreateInput, GameStatsUncheckedCreateInput>
  }

  /**
   * GameStats createMany
   */
  export type GameStatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameStats.
     */
    data: GameStatsCreateManyInput | GameStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameStats createManyAndReturn
   */
  export type GameStatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * The data used to create many GameStats.
     */
    data: GameStatsCreateManyInput | GameStatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameStats update
   */
  export type GameStatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * The data needed to update a GameStats.
     */
    data: XOR<GameStatsUpdateInput, GameStatsUncheckedUpdateInput>
    /**
     * Choose, which GameStats to update.
     */
    where: GameStatsWhereUniqueInput
  }

  /**
   * GameStats updateMany
   */
  export type GameStatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameStats.
     */
    data: XOR<GameStatsUpdateManyMutationInput, GameStatsUncheckedUpdateManyInput>
    /**
     * Filter which GameStats to update
     */
    where?: GameStatsWhereInput
    /**
     * Limit how many GameStats to update.
     */
    limit?: number
  }

  /**
   * GameStats updateManyAndReturn
   */
  export type GameStatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * The data used to update GameStats.
     */
    data: XOR<GameStatsUpdateManyMutationInput, GameStatsUncheckedUpdateManyInput>
    /**
     * Filter which GameStats to update
     */
    where?: GameStatsWhereInput
    /**
     * Limit how many GameStats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameStats upsert
   */
  export type GameStatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * The filter to search for the GameStats to update in case it exists.
     */
    where: GameStatsWhereUniqueInput
    /**
     * In case the GameStats found by the `where` argument doesn't exist, create a new GameStats with this data.
     */
    create: XOR<GameStatsCreateInput, GameStatsUncheckedCreateInput>
    /**
     * In case the GameStats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameStatsUpdateInput, GameStatsUncheckedUpdateInput>
  }

  /**
   * GameStats delete
   */
  export type GameStatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
    /**
     * Filter which GameStats to delete.
     */
    where: GameStatsWhereUniqueInput
  }

  /**
   * GameStats deleteMany
   */
  export type GameStatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameStats to delete
     */
    where?: GameStatsWhereInput
    /**
     * Limit how many GameStats to delete.
     */
    limit?: number
  }

  /**
   * GameStats without action
   */
  export type GameStatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameStats
     */
    select?: GameStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameStats
     */
    omit?: GameStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameStatsInclude<ExtArgs> | null
  }


  /**
   * Model RewardClaim
   */

  export type AggregateRewardClaim = {
    _count: RewardClaimCountAggregateOutputType | null
    _avg: RewardClaimAvgAggregateOutputType | null
    _sum: RewardClaimSumAggregateOutputType | null
    _min: RewardClaimMinAggregateOutputType | null
    _max: RewardClaimMaxAggregateOutputType | null
  }

  export type RewardClaimAvgAggregateOutputType = {
    amount: number | null
  }

  export type RewardClaimSumAggregateOutputType = {
    amount: number | null
  }

  export type RewardClaimMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    rewardType: $Enums.RewardType | null
    amount: number | null
    status: $Enums.ClaimStatus | null
    period: string | null
    description: string | null
    createdAt: Date | null
    claimedAt: Date | null
  }

  export type RewardClaimMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    rewardType: $Enums.RewardType | null
    amount: number | null
    status: $Enums.ClaimStatus | null
    period: string | null
    description: string | null
    createdAt: Date | null
    claimedAt: Date | null
  }

  export type RewardClaimCountAggregateOutputType = {
    id: number
    walletId: number
    rewardType: number
    amount: number
    status: number
    period: number
    description: number
    createdAt: number
    claimedAt: number
    _all: number
  }


  export type RewardClaimAvgAggregateInputType = {
    amount?: true
  }

  export type RewardClaimSumAggregateInputType = {
    amount?: true
  }

  export type RewardClaimMinAggregateInputType = {
    id?: true
    walletId?: true
    rewardType?: true
    amount?: true
    status?: true
    period?: true
    description?: true
    createdAt?: true
    claimedAt?: true
  }

  export type RewardClaimMaxAggregateInputType = {
    id?: true
    walletId?: true
    rewardType?: true
    amount?: true
    status?: true
    period?: true
    description?: true
    createdAt?: true
    claimedAt?: true
  }

  export type RewardClaimCountAggregateInputType = {
    id?: true
    walletId?: true
    rewardType?: true
    amount?: true
    status?: true
    period?: true
    description?: true
    createdAt?: true
    claimedAt?: true
    _all?: true
  }

  export type RewardClaimAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RewardClaim to aggregate.
     */
    where?: RewardClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RewardClaims to fetch.
     */
    orderBy?: RewardClaimOrderByWithRelationInput | RewardClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RewardClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RewardClaims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RewardClaims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RewardClaims
    **/
    _count?: true | RewardClaimCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RewardClaimAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RewardClaimSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RewardClaimMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RewardClaimMaxAggregateInputType
  }

  export type GetRewardClaimAggregateType<T extends RewardClaimAggregateArgs> = {
        [P in keyof T & keyof AggregateRewardClaim]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRewardClaim[P]>
      : GetScalarType<T[P], AggregateRewardClaim[P]>
  }




  export type RewardClaimGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RewardClaimWhereInput
    orderBy?: RewardClaimOrderByWithAggregationInput | RewardClaimOrderByWithAggregationInput[]
    by: RewardClaimScalarFieldEnum[] | RewardClaimScalarFieldEnum
    having?: RewardClaimScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RewardClaimCountAggregateInputType | true
    _avg?: RewardClaimAvgAggregateInputType
    _sum?: RewardClaimSumAggregateInputType
    _min?: RewardClaimMinAggregateInputType
    _max?: RewardClaimMaxAggregateInputType
  }

  export type RewardClaimGroupByOutputType = {
    id: string
    walletId: string
    rewardType: $Enums.RewardType
    amount: number
    status: $Enums.ClaimStatus
    period: string
    description: string
    createdAt: Date
    claimedAt: Date | null
    _count: RewardClaimCountAggregateOutputType | null
    _avg: RewardClaimAvgAggregateOutputType | null
    _sum: RewardClaimSumAggregateOutputType | null
    _min: RewardClaimMinAggregateOutputType | null
    _max: RewardClaimMaxAggregateOutputType | null
  }

  type GetRewardClaimGroupByPayload<T extends RewardClaimGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RewardClaimGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RewardClaimGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RewardClaimGroupByOutputType[P]>
            : GetScalarType<T[P], RewardClaimGroupByOutputType[P]>
        }
      >
    >


  export type RewardClaimSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    rewardType?: boolean
    amount?: boolean
    status?: boolean
    period?: boolean
    description?: boolean
    createdAt?: boolean
    claimedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rewardClaim"]>

  export type RewardClaimSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    rewardType?: boolean
    amount?: boolean
    status?: boolean
    period?: boolean
    description?: boolean
    createdAt?: boolean
    claimedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rewardClaim"]>

  export type RewardClaimSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    rewardType?: boolean
    amount?: boolean
    status?: boolean
    period?: boolean
    description?: boolean
    createdAt?: boolean
    claimedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rewardClaim"]>

  export type RewardClaimSelectScalar = {
    id?: boolean
    walletId?: boolean
    rewardType?: boolean
    amount?: boolean
    status?: boolean
    period?: boolean
    description?: boolean
    createdAt?: boolean
    claimedAt?: boolean
  }

  export type RewardClaimOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "rewardType" | "amount" | "status" | "period" | "description" | "createdAt" | "claimedAt", ExtArgs["result"]["rewardClaim"]>
  export type RewardClaimInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type RewardClaimIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type RewardClaimIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }

  export type $RewardClaimPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RewardClaim"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      rewardType: $Enums.RewardType
      amount: number
      status: $Enums.ClaimStatus
      period: string
      description: string
      createdAt: Date
      claimedAt: Date | null
    }, ExtArgs["result"]["rewardClaim"]>
    composites: {}
  }

  type RewardClaimGetPayload<S extends boolean | null | undefined | RewardClaimDefaultArgs> = $Result.GetResult<Prisma.$RewardClaimPayload, S>

  type RewardClaimCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RewardClaimFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RewardClaimCountAggregateInputType | true
    }

  export interface RewardClaimDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RewardClaim'], meta: { name: 'RewardClaim' } }
    /**
     * Find zero or one RewardClaim that matches the filter.
     * @param {RewardClaimFindUniqueArgs} args - Arguments to find a RewardClaim
     * @example
     * // Get one RewardClaim
     * const rewardClaim = await prisma.rewardClaim.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RewardClaimFindUniqueArgs>(args: SelectSubset<T, RewardClaimFindUniqueArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RewardClaim that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RewardClaimFindUniqueOrThrowArgs} args - Arguments to find a RewardClaim
     * @example
     * // Get one RewardClaim
     * const rewardClaim = await prisma.rewardClaim.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RewardClaimFindUniqueOrThrowArgs>(args: SelectSubset<T, RewardClaimFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RewardClaim that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimFindFirstArgs} args - Arguments to find a RewardClaim
     * @example
     * // Get one RewardClaim
     * const rewardClaim = await prisma.rewardClaim.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RewardClaimFindFirstArgs>(args?: SelectSubset<T, RewardClaimFindFirstArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RewardClaim that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimFindFirstOrThrowArgs} args - Arguments to find a RewardClaim
     * @example
     * // Get one RewardClaim
     * const rewardClaim = await prisma.rewardClaim.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RewardClaimFindFirstOrThrowArgs>(args?: SelectSubset<T, RewardClaimFindFirstOrThrowArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RewardClaims that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RewardClaims
     * const rewardClaims = await prisma.rewardClaim.findMany()
     * 
     * // Get first 10 RewardClaims
     * const rewardClaims = await prisma.rewardClaim.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rewardClaimWithIdOnly = await prisma.rewardClaim.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RewardClaimFindManyArgs>(args?: SelectSubset<T, RewardClaimFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RewardClaim.
     * @param {RewardClaimCreateArgs} args - Arguments to create a RewardClaim.
     * @example
     * // Create one RewardClaim
     * const RewardClaim = await prisma.rewardClaim.create({
     *   data: {
     *     // ... data to create a RewardClaim
     *   }
     * })
     * 
     */
    create<T extends RewardClaimCreateArgs>(args: SelectSubset<T, RewardClaimCreateArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RewardClaims.
     * @param {RewardClaimCreateManyArgs} args - Arguments to create many RewardClaims.
     * @example
     * // Create many RewardClaims
     * const rewardClaim = await prisma.rewardClaim.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RewardClaimCreateManyArgs>(args?: SelectSubset<T, RewardClaimCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RewardClaims and returns the data saved in the database.
     * @param {RewardClaimCreateManyAndReturnArgs} args - Arguments to create many RewardClaims.
     * @example
     * // Create many RewardClaims
     * const rewardClaim = await prisma.rewardClaim.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RewardClaims and only return the `id`
     * const rewardClaimWithIdOnly = await prisma.rewardClaim.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RewardClaimCreateManyAndReturnArgs>(args?: SelectSubset<T, RewardClaimCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RewardClaim.
     * @param {RewardClaimDeleteArgs} args - Arguments to delete one RewardClaim.
     * @example
     * // Delete one RewardClaim
     * const RewardClaim = await prisma.rewardClaim.delete({
     *   where: {
     *     // ... filter to delete one RewardClaim
     *   }
     * })
     * 
     */
    delete<T extends RewardClaimDeleteArgs>(args: SelectSubset<T, RewardClaimDeleteArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RewardClaim.
     * @param {RewardClaimUpdateArgs} args - Arguments to update one RewardClaim.
     * @example
     * // Update one RewardClaim
     * const rewardClaim = await prisma.rewardClaim.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RewardClaimUpdateArgs>(args: SelectSubset<T, RewardClaimUpdateArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RewardClaims.
     * @param {RewardClaimDeleteManyArgs} args - Arguments to filter RewardClaims to delete.
     * @example
     * // Delete a few RewardClaims
     * const { count } = await prisma.rewardClaim.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RewardClaimDeleteManyArgs>(args?: SelectSubset<T, RewardClaimDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RewardClaims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RewardClaims
     * const rewardClaim = await prisma.rewardClaim.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RewardClaimUpdateManyArgs>(args: SelectSubset<T, RewardClaimUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RewardClaims and returns the data updated in the database.
     * @param {RewardClaimUpdateManyAndReturnArgs} args - Arguments to update many RewardClaims.
     * @example
     * // Update many RewardClaims
     * const rewardClaim = await prisma.rewardClaim.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RewardClaims and only return the `id`
     * const rewardClaimWithIdOnly = await prisma.rewardClaim.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RewardClaimUpdateManyAndReturnArgs>(args: SelectSubset<T, RewardClaimUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RewardClaim.
     * @param {RewardClaimUpsertArgs} args - Arguments to update or create a RewardClaim.
     * @example
     * // Update or create a RewardClaim
     * const rewardClaim = await prisma.rewardClaim.upsert({
     *   create: {
     *     // ... data to create a RewardClaim
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RewardClaim we want to update
     *   }
     * })
     */
    upsert<T extends RewardClaimUpsertArgs>(args: SelectSubset<T, RewardClaimUpsertArgs<ExtArgs>>): Prisma__RewardClaimClient<$Result.GetResult<Prisma.$RewardClaimPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RewardClaims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimCountArgs} args - Arguments to filter RewardClaims to count.
     * @example
     * // Count the number of RewardClaims
     * const count = await prisma.rewardClaim.count({
     *   where: {
     *     // ... the filter for the RewardClaims we want to count
     *   }
     * })
    **/
    count<T extends RewardClaimCountArgs>(
      args?: Subset<T, RewardClaimCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RewardClaimCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RewardClaim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RewardClaimAggregateArgs>(args: Subset<T, RewardClaimAggregateArgs>): Prisma.PrismaPromise<GetRewardClaimAggregateType<T>>

    /**
     * Group by RewardClaim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RewardClaimGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RewardClaimGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RewardClaimGroupByArgs['orderBy'] }
        : { orderBy?: RewardClaimGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RewardClaimGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRewardClaimGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RewardClaim model
   */
  readonly fields: RewardClaimFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RewardClaim.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RewardClaimClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RewardClaim model
   */
  interface RewardClaimFieldRefs {
    readonly id: FieldRef<"RewardClaim", 'String'>
    readonly walletId: FieldRef<"RewardClaim", 'String'>
    readonly rewardType: FieldRef<"RewardClaim", 'RewardType'>
    readonly amount: FieldRef<"RewardClaim", 'Float'>
    readonly status: FieldRef<"RewardClaim", 'ClaimStatus'>
    readonly period: FieldRef<"RewardClaim", 'String'>
    readonly description: FieldRef<"RewardClaim", 'String'>
    readonly createdAt: FieldRef<"RewardClaim", 'DateTime'>
    readonly claimedAt: FieldRef<"RewardClaim", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RewardClaim findUnique
   */
  export type RewardClaimFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter, which RewardClaim to fetch.
     */
    where: RewardClaimWhereUniqueInput
  }

  /**
   * RewardClaim findUniqueOrThrow
   */
  export type RewardClaimFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter, which RewardClaim to fetch.
     */
    where: RewardClaimWhereUniqueInput
  }

  /**
   * RewardClaim findFirst
   */
  export type RewardClaimFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter, which RewardClaim to fetch.
     */
    where?: RewardClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RewardClaims to fetch.
     */
    orderBy?: RewardClaimOrderByWithRelationInput | RewardClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RewardClaims.
     */
    cursor?: RewardClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RewardClaims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RewardClaims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RewardClaims.
     */
    distinct?: RewardClaimScalarFieldEnum | RewardClaimScalarFieldEnum[]
  }

  /**
   * RewardClaim findFirstOrThrow
   */
  export type RewardClaimFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter, which RewardClaim to fetch.
     */
    where?: RewardClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RewardClaims to fetch.
     */
    orderBy?: RewardClaimOrderByWithRelationInput | RewardClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RewardClaims.
     */
    cursor?: RewardClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RewardClaims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RewardClaims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RewardClaims.
     */
    distinct?: RewardClaimScalarFieldEnum | RewardClaimScalarFieldEnum[]
  }

  /**
   * RewardClaim findMany
   */
  export type RewardClaimFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter, which RewardClaims to fetch.
     */
    where?: RewardClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RewardClaims to fetch.
     */
    orderBy?: RewardClaimOrderByWithRelationInput | RewardClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RewardClaims.
     */
    cursor?: RewardClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RewardClaims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RewardClaims.
     */
    skip?: number
    distinct?: RewardClaimScalarFieldEnum | RewardClaimScalarFieldEnum[]
  }

  /**
   * RewardClaim create
   */
  export type RewardClaimCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * The data needed to create a RewardClaim.
     */
    data: XOR<RewardClaimCreateInput, RewardClaimUncheckedCreateInput>
  }

  /**
   * RewardClaim createMany
   */
  export type RewardClaimCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RewardClaims.
     */
    data: RewardClaimCreateManyInput | RewardClaimCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RewardClaim createManyAndReturn
   */
  export type RewardClaimCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * The data used to create many RewardClaims.
     */
    data: RewardClaimCreateManyInput | RewardClaimCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RewardClaim update
   */
  export type RewardClaimUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * The data needed to update a RewardClaim.
     */
    data: XOR<RewardClaimUpdateInput, RewardClaimUncheckedUpdateInput>
    /**
     * Choose, which RewardClaim to update.
     */
    where: RewardClaimWhereUniqueInput
  }

  /**
   * RewardClaim updateMany
   */
  export type RewardClaimUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RewardClaims.
     */
    data: XOR<RewardClaimUpdateManyMutationInput, RewardClaimUncheckedUpdateManyInput>
    /**
     * Filter which RewardClaims to update
     */
    where?: RewardClaimWhereInput
    /**
     * Limit how many RewardClaims to update.
     */
    limit?: number
  }

  /**
   * RewardClaim updateManyAndReturn
   */
  export type RewardClaimUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * The data used to update RewardClaims.
     */
    data: XOR<RewardClaimUpdateManyMutationInput, RewardClaimUncheckedUpdateManyInput>
    /**
     * Filter which RewardClaims to update
     */
    where?: RewardClaimWhereInput
    /**
     * Limit how many RewardClaims to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RewardClaim upsert
   */
  export type RewardClaimUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * The filter to search for the RewardClaim to update in case it exists.
     */
    where: RewardClaimWhereUniqueInput
    /**
     * In case the RewardClaim found by the `where` argument doesn't exist, create a new RewardClaim with this data.
     */
    create: XOR<RewardClaimCreateInput, RewardClaimUncheckedCreateInput>
    /**
     * In case the RewardClaim was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RewardClaimUpdateInput, RewardClaimUncheckedUpdateInput>
  }

  /**
   * RewardClaim delete
   */
  export type RewardClaimDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
    /**
     * Filter which RewardClaim to delete.
     */
    where: RewardClaimWhereUniqueInput
  }

  /**
   * RewardClaim deleteMany
   */
  export type RewardClaimDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RewardClaims to delete
     */
    where?: RewardClaimWhereInput
    /**
     * Limit how many RewardClaims to delete.
     */
    limit?: number
  }

  /**
   * RewardClaim without action
   */
  export type RewardClaimDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RewardClaim
     */
    select?: RewardClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RewardClaim
     */
    omit?: RewardClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RewardClaimInclude<ExtArgs> | null
  }


  /**
   * Model Jackpot
   */

  export type AggregateJackpot = {
    _count: JackpotCountAggregateOutputType | null
    _avg: JackpotAvgAggregateOutputType | null
    _sum: JackpotSumAggregateOutputType | null
    _min: JackpotMinAggregateOutputType | null
    _max: JackpotMaxAggregateOutputType | null
  }

  export type JackpotAvgAggregateOutputType = {
    id: number | null
    balance: number | null
    totalContributions: number | null
    lastWinAmount: number | null
  }

  export type JackpotSumAggregateOutputType = {
    id: number | null
    balance: number | null
    totalContributions: number | null
    lastWinAmount: number | null
  }

  export type JackpotMinAggregateOutputType = {
    id: number | null
    balance: number | null
    totalContributions: number | null
    lastWinner: string | null
    lastWinAmount: number | null
    lastWinDate: Date | null
    lastUpdate: Date | null
  }

  export type JackpotMaxAggregateOutputType = {
    id: number | null
    balance: number | null
    totalContributions: number | null
    lastWinner: string | null
    lastWinAmount: number | null
    lastWinDate: Date | null
    lastUpdate: Date | null
  }

  export type JackpotCountAggregateOutputType = {
    id: number
    balance: number
    totalContributions: number
    lastWinner: number
    lastWinAmount: number
    lastWinDate: number
    lastUpdate: number
    _all: number
  }


  export type JackpotAvgAggregateInputType = {
    id?: true
    balance?: true
    totalContributions?: true
    lastWinAmount?: true
  }

  export type JackpotSumAggregateInputType = {
    id?: true
    balance?: true
    totalContributions?: true
    lastWinAmount?: true
  }

  export type JackpotMinAggregateInputType = {
    id?: true
    balance?: true
    totalContributions?: true
    lastWinner?: true
    lastWinAmount?: true
    lastWinDate?: true
    lastUpdate?: true
  }

  export type JackpotMaxAggregateInputType = {
    id?: true
    balance?: true
    totalContributions?: true
    lastWinner?: true
    lastWinAmount?: true
    lastWinDate?: true
    lastUpdate?: true
  }

  export type JackpotCountAggregateInputType = {
    id?: true
    balance?: true
    totalContributions?: true
    lastWinner?: true
    lastWinAmount?: true
    lastWinDate?: true
    lastUpdate?: true
    _all?: true
  }

  export type JackpotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jackpot to aggregate.
     */
    where?: JackpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jackpots to fetch.
     */
    orderBy?: JackpotOrderByWithRelationInput | JackpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JackpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jackpots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jackpots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jackpots
    **/
    _count?: true | JackpotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JackpotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JackpotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JackpotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JackpotMaxAggregateInputType
  }

  export type GetJackpotAggregateType<T extends JackpotAggregateArgs> = {
        [P in keyof T & keyof AggregateJackpot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJackpot[P]>
      : GetScalarType<T[P], AggregateJackpot[P]>
  }




  export type JackpotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JackpotWhereInput
    orderBy?: JackpotOrderByWithAggregationInput | JackpotOrderByWithAggregationInput[]
    by: JackpotScalarFieldEnum[] | JackpotScalarFieldEnum
    having?: JackpotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JackpotCountAggregateInputType | true
    _avg?: JackpotAvgAggregateInputType
    _sum?: JackpotSumAggregateInputType
    _min?: JackpotMinAggregateInputType
    _max?: JackpotMaxAggregateInputType
  }

  export type JackpotGroupByOutputType = {
    id: number
    balance: number
    totalContributions: number
    lastWinner: string | null
    lastWinAmount: number | null
    lastWinDate: Date | null
    lastUpdate: Date
    _count: JackpotCountAggregateOutputType | null
    _avg: JackpotAvgAggregateOutputType | null
    _sum: JackpotSumAggregateOutputType | null
    _min: JackpotMinAggregateOutputType | null
    _max: JackpotMaxAggregateOutputType | null
  }

  type GetJackpotGroupByPayload<T extends JackpotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JackpotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JackpotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JackpotGroupByOutputType[P]>
            : GetScalarType<T[P], JackpotGroupByOutputType[P]>
        }
      >
    >


  export type JackpotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    balance?: boolean
    totalContributions?: boolean
    lastWinner?: boolean
    lastWinAmount?: boolean
    lastWinDate?: boolean
    lastUpdate?: boolean
  }, ExtArgs["result"]["jackpot"]>

  export type JackpotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    balance?: boolean
    totalContributions?: boolean
    lastWinner?: boolean
    lastWinAmount?: boolean
    lastWinDate?: boolean
    lastUpdate?: boolean
  }, ExtArgs["result"]["jackpot"]>

  export type JackpotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    balance?: boolean
    totalContributions?: boolean
    lastWinner?: boolean
    lastWinAmount?: boolean
    lastWinDate?: boolean
    lastUpdate?: boolean
  }, ExtArgs["result"]["jackpot"]>

  export type JackpotSelectScalar = {
    id?: boolean
    balance?: boolean
    totalContributions?: boolean
    lastWinner?: boolean
    lastWinAmount?: boolean
    lastWinDate?: boolean
    lastUpdate?: boolean
  }

  export type JackpotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "balance" | "totalContributions" | "lastWinner" | "lastWinAmount" | "lastWinDate" | "lastUpdate", ExtArgs["result"]["jackpot"]>

  export type $JackpotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Jackpot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      balance: number
      totalContributions: number
      lastWinner: string | null
      lastWinAmount: number | null
      lastWinDate: Date | null
      lastUpdate: Date
    }, ExtArgs["result"]["jackpot"]>
    composites: {}
  }

  type JackpotGetPayload<S extends boolean | null | undefined | JackpotDefaultArgs> = $Result.GetResult<Prisma.$JackpotPayload, S>

  type JackpotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JackpotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JackpotCountAggregateInputType | true
    }

  export interface JackpotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Jackpot'], meta: { name: 'Jackpot' } }
    /**
     * Find zero or one Jackpot that matches the filter.
     * @param {JackpotFindUniqueArgs} args - Arguments to find a Jackpot
     * @example
     * // Get one Jackpot
     * const jackpot = await prisma.jackpot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JackpotFindUniqueArgs>(args: SelectSubset<T, JackpotFindUniqueArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Jackpot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JackpotFindUniqueOrThrowArgs} args - Arguments to find a Jackpot
     * @example
     * // Get one Jackpot
     * const jackpot = await prisma.jackpot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JackpotFindUniqueOrThrowArgs>(args: SelectSubset<T, JackpotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jackpot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotFindFirstArgs} args - Arguments to find a Jackpot
     * @example
     * // Get one Jackpot
     * const jackpot = await prisma.jackpot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JackpotFindFirstArgs>(args?: SelectSubset<T, JackpotFindFirstArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jackpot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotFindFirstOrThrowArgs} args - Arguments to find a Jackpot
     * @example
     * // Get one Jackpot
     * const jackpot = await prisma.jackpot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JackpotFindFirstOrThrowArgs>(args?: SelectSubset<T, JackpotFindFirstOrThrowArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jackpots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jackpots
     * const jackpots = await prisma.jackpot.findMany()
     * 
     * // Get first 10 Jackpots
     * const jackpots = await prisma.jackpot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jackpotWithIdOnly = await prisma.jackpot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JackpotFindManyArgs>(args?: SelectSubset<T, JackpotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Jackpot.
     * @param {JackpotCreateArgs} args - Arguments to create a Jackpot.
     * @example
     * // Create one Jackpot
     * const Jackpot = await prisma.jackpot.create({
     *   data: {
     *     // ... data to create a Jackpot
     *   }
     * })
     * 
     */
    create<T extends JackpotCreateArgs>(args: SelectSubset<T, JackpotCreateArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jackpots.
     * @param {JackpotCreateManyArgs} args - Arguments to create many Jackpots.
     * @example
     * // Create many Jackpots
     * const jackpot = await prisma.jackpot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JackpotCreateManyArgs>(args?: SelectSubset<T, JackpotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jackpots and returns the data saved in the database.
     * @param {JackpotCreateManyAndReturnArgs} args - Arguments to create many Jackpots.
     * @example
     * // Create many Jackpots
     * const jackpot = await prisma.jackpot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jackpots and only return the `id`
     * const jackpotWithIdOnly = await prisma.jackpot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JackpotCreateManyAndReturnArgs>(args?: SelectSubset<T, JackpotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Jackpot.
     * @param {JackpotDeleteArgs} args - Arguments to delete one Jackpot.
     * @example
     * // Delete one Jackpot
     * const Jackpot = await prisma.jackpot.delete({
     *   where: {
     *     // ... filter to delete one Jackpot
     *   }
     * })
     * 
     */
    delete<T extends JackpotDeleteArgs>(args: SelectSubset<T, JackpotDeleteArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Jackpot.
     * @param {JackpotUpdateArgs} args - Arguments to update one Jackpot.
     * @example
     * // Update one Jackpot
     * const jackpot = await prisma.jackpot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JackpotUpdateArgs>(args: SelectSubset<T, JackpotUpdateArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jackpots.
     * @param {JackpotDeleteManyArgs} args - Arguments to filter Jackpots to delete.
     * @example
     * // Delete a few Jackpots
     * const { count } = await prisma.jackpot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JackpotDeleteManyArgs>(args?: SelectSubset<T, JackpotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jackpots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jackpots
     * const jackpot = await prisma.jackpot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JackpotUpdateManyArgs>(args: SelectSubset<T, JackpotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jackpots and returns the data updated in the database.
     * @param {JackpotUpdateManyAndReturnArgs} args - Arguments to update many Jackpots.
     * @example
     * // Update many Jackpots
     * const jackpot = await prisma.jackpot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jackpots and only return the `id`
     * const jackpotWithIdOnly = await prisma.jackpot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JackpotUpdateManyAndReturnArgs>(args: SelectSubset<T, JackpotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Jackpot.
     * @param {JackpotUpsertArgs} args - Arguments to update or create a Jackpot.
     * @example
     * // Update or create a Jackpot
     * const jackpot = await prisma.jackpot.upsert({
     *   create: {
     *     // ... data to create a Jackpot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Jackpot we want to update
     *   }
     * })
     */
    upsert<T extends JackpotUpsertArgs>(args: SelectSubset<T, JackpotUpsertArgs<ExtArgs>>): Prisma__JackpotClient<$Result.GetResult<Prisma.$JackpotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jackpots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotCountArgs} args - Arguments to filter Jackpots to count.
     * @example
     * // Count the number of Jackpots
     * const count = await prisma.jackpot.count({
     *   where: {
     *     // ... the filter for the Jackpots we want to count
     *   }
     * })
    **/
    count<T extends JackpotCountArgs>(
      args?: Subset<T, JackpotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JackpotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Jackpot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JackpotAggregateArgs>(args: Subset<T, JackpotAggregateArgs>): Prisma.PrismaPromise<GetJackpotAggregateType<T>>

    /**
     * Group by Jackpot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JackpotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JackpotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JackpotGroupByArgs['orderBy'] }
        : { orderBy?: JackpotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JackpotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJackpotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Jackpot model
   */
  readonly fields: JackpotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Jackpot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JackpotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Jackpot model
   */
  interface JackpotFieldRefs {
    readonly id: FieldRef<"Jackpot", 'Int'>
    readonly balance: FieldRef<"Jackpot", 'Float'>
    readonly totalContributions: FieldRef<"Jackpot", 'Float'>
    readonly lastWinner: FieldRef<"Jackpot", 'String'>
    readonly lastWinAmount: FieldRef<"Jackpot", 'Float'>
    readonly lastWinDate: FieldRef<"Jackpot", 'DateTime'>
    readonly lastUpdate: FieldRef<"Jackpot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Jackpot findUnique
   */
  export type JackpotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter, which Jackpot to fetch.
     */
    where: JackpotWhereUniqueInput
  }

  /**
   * Jackpot findUniqueOrThrow
   */
  export type JackpotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter, which Jackpot to fetch.
     */
    where: JackpotWhereUniqueInput
  }

  /**
   * Jackpot findFirst
   */
  export type JackpotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter, which Jackpot to fetch.
     */
    where?: JackpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jackpots to fetch.
     */
    orderBy?: JackpotOrderByWithRelationInput | JackpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jackpots.
     */
    cursor?: JackpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jackpots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jackpots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jackpots.
     */
    distinct?: JackpotScalarFieldEnum | JackpotScalarFieldEnum[]
  }

  /**
   * Jackpot findFirstOrThrow
   */
  export type JackpotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter, which Jackpot to fetch.
     */
    where?: JackpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jackpots to fetch.
     */
    orderBy?: JackpotOrderByWithRelationInput | JackpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jackpots.
     */
    cursor?: JackpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jackpots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jackpots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jackpots.
     */
    distinct?: JackpotScalarFieldEnum | JackpotScalarFieldEnum[]
  }

  /**
   * Jackpot findMany
   */
  export type JackpotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter, which Jackpots to fetch.
     */
    where?: JackpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jackpots to fetch.
     */
    orderBy?: JackpotOrderByWithRelationInput | JackpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jackpots.
     */
    cursor?: JackpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jackpots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jackpots.
     */
    skip?: number
    distinct?: JackpotScalarFieldEnum | JackpotScalarFieldEnum[]
  }

  /**
   * Jackpot create
   */
  export type JackpotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * The data needed to create a Jackpot.
     */
    data?: XOR<JackpotCreateInput, JackpotUncheckedCreateInput>
  }

  /**
   * Jackpot createMany
   */
  export type JackpotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jackpots.
     */
    data: JackpotCreateManyInput | JackpotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Jackpot createManyAndReturn
   */
  export type JackpotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * The data used to create many Jackpots.
     */
    data: JackpotCreateManyInput | JackpotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Jackpot update
   */
  export type JackpotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * The data needed to update a Jackpot.
     */
    data: XOR<JackpotUpdateInput, JackpotUncheckedUpdateInput>
    /**
     * Choose, which Jackpot to update.
     */
    where: JackpotWhereUniqueInput
  }

  /**
   * Jackpot updateMany
   */
  export type JackpotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jackpots.
     */
    data: XOR<JackpotUpdateManyMutationInput, JackpotUncheckedUpdateManyInput>
    /**
     * Filter which Jackpots to update
     */
    where?: JackpotWhereInput
    /**
     * Limit how many Jackpots to update.
     */
    limit?: number
  }

  /**
   * Jackpot updateManyAndReturn
   */
  export type JackpotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * The data used to update Jackpots.
     */
    data: XOR<JackpotUpdateManyMutationInput, JackpotUncheckedUpdateManyInput>
    /**
     * Filter which Jackpots to update
     */
    where?: JackpotWhereInput
    /**
     * Limit how many Jackpots to update.
     */
    limit?: number
  }

  /**
   * Jackpot upsert
   */
  export type JackpotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * The filter to search for the Jackpot to update in case it exists.
     */
    where: JackpotWhereUniqueInput
    /**
     * In case the Jackpot found by the `where` argument doesn't exist, create a new Jackpot with this data.
     */
    create: XOR<JackpotCreateInput, JackpotUncheckedCreateInput>
    /**
     * In case the Jackpot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JackpotUpdateInput, JackpotUncheckedUpdateInput>
  }

  /**
   * Jackpot delete
   */
  export type JackpotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
    /**
     * Filter which Jackpot to delete.
     */
    where: JackpotWhereUniqueInput
  }

  /**
   * Jackpot deleteMany
   */
  export type JackpotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jackpots to delete
     */
    where?: JackpotWhereInput
    /**
     * Limit how many Jackpots to delete.
     */
    limit?: number
  }

  /**
   * Jackpot without action
   */
  export type JackpotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jackpot
     */
    select?: JackpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jackpot
     */
    omit?: JackpotOmit<ExtArgs> | null
  }


  /**
   * Model Raffle
   */

  export type AggregateRaffle = {
    _count: RaffleCountAggregateOutputType | null
    _avg: RaffleAvgAggregateOutputType | null
    _sum: RaffleSumAggregateOutputType | null
    _min: RaffleMinAggregateOutputType | null
    _max: RaffleMaxAggregateOutputType | null
  }

  export type RaffleAvgAggregateOutputType = {
    id: number | null
    ticketPrice: number | null
    totalTickets: number | null
    soldTickets: number | null
  }

  export type RaffleSumAggregateOutputType = {
    id: number | null
    ticketPrice: number | null
    totalTickets: number | null
    soldTickets: number | null
  }

  export type RaffleMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    image: string | null
    ticketPrice: number | null
    totalTickets: number | null
    soldTickets: number | null
    endsAt: Date | null
    winner: string | null
    winnerPickedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RaffleMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    image: string | null
    ticketPrice: number | null
    totalTickets: number | null
    soldTickets: number | null
    endsAt: Date | null
    winner: string | null
    winnerPickedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RaffleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    image: number
    ticketPrice: number
    totalTickets: number
    soldTickets: number
    endsAt: number
    winner: number
    winnerPickedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RaffleAvgAggregateInputType = {
    id?: true
    ticketPrice?: true
    totalTickets?: true
    soldTickets?: true
  }

  export type RaffleSumAggregateInputType = {
    id?: true
    ticketPrice?: true
    totalTickets?: true
    soldTickets?: true
  }

  export type RaffleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image?: true
    ticketPrice?: true
    totalTickets?: true
    soldTickets?: true
    endsAt?: true
    winner?: true
    winnerPickedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RaffleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image?: true
    ticketPrice?: true
    totalTickets?: true
    soldTickets?: true
    endsAt?: true
    winner?: true
    winnerPickedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RaffleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image?: true
    ticketPrice?: true
    totalTickets?: true
    soldTickets?: true
    endsAt?: true
    winner?: true
    winnerPickedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RaffleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Raffle to aggregate.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Raffles
    **/
    _count?: true | RaffleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RaffleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RaffleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RaffleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RaffleMaxAggregateInputType
  }

  export type GetRaffleAggregateType<T extends RaffleAggregateArgs> = {
        [P in keyof T & keyof AggregateRaffle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRaffle[P]>
      : GetScalarType<T[P], AggregateRaffle[P]>
  }




  export type RaffleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleWhereInput
    orderBy?: RaffleOrderByWithAggregationInput | RaffleOrderByWithAggregationInput[]
    by: RaffleScalarFieldEnum[] | RaffleScalarFieldEnum
    having?: RaffleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RaffleCountAggregateInputType | true
    _avg?: RaffleAvgAggregateInputType
    _sum?: RaffleSumAggregateInputType
    _min?: RaffleMinAggregateInputType
    _max?: RaffleMaxAggregateInputType
  }

  export type RaffleGroupByOutputType = {
    id: number
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets: number
    endsAt: Date
    winner: string | null
    winnerPickedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: RaffleCountAggregateOutputType | null
    _avg: RaffleAvgAggregateOutputType | null
    _sum: RaffleSumAggregateOutputType | null
    _min: RaffleMinAggregateOutputType | null
    _max: RaffleMaxAggregateOutputType | null
  }

  type GetRaffleGroupByPayload<T extends RaffleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RaffleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RaffleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RaffleGroupByOutputType[P]>
            : GetScalarType<T[P], RaffleGroupByOutputType[P]>
        }
      >
    >


  export type RaffleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    ticketPrice?: boolean
    totalTickets?: boolean
    soldTickets?: boolean
    endsAt?: boolean
    winner?: boolean
    winnerPickedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tickets?: boolean | Raffle$ticketsArgs<ExtArgs>
    _count?: boolean | RaffleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    ticketPrice?: boolean
    totalTickets?: boolean
    soldTickets?: boolean
    endsAt?: boolean
    winner?: boolean
    winnerPickedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    ticketPrice?: boolean
    totalTickets?: boolean
    soldTickets?: boolean
    endsAt?: boolean
    winner?: boolean
    winnerPickedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    ticketPrice?: boolean
    totalTickets?: boolean
    soldTickets?: boolean
    endsAt?: boolean
    winner?: boolean
    winnerPickedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RaffleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "image" | "ticketPrice" | "totalTickets" | "soldTickets" | "endsAt" | "winner" | "winnerPickedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["raffle"]>
  export type RaffleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | Raffle$ticketsArgs<ExtArgs>
    _count?: boolean | RaffleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RaffleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RaffleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RafflePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Raffle"
    objects: {
      tickets: Prisma.$RaffleTicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string
      image: string
      ticketPrice: number
      totalTickets: number
      soldTickets: number
      endsAt: Date
      winner: string | null
      winnerPickedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["raffle"]>
    composites: {}
  }

  type RaffleGetPayload<S extends boolean | null | undefined | RaffleDefaultArgs> = $Result.GetResult<Prisma.$RafflePayload, S>

  type RaffleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RaffleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RaffleCountAggregateInputType | true
    }

  export interface RaffleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Raffle'], meta: { name: 'Raffle' } }
    /**
     * Find zero or one Raffle that matches the filter.
     * @param {RaffleFindUniqueArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RaffleFindUniqueArgs>(args: SelectSubset<T, RaffleFindUniqueArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Raffle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RaffleFindUniqueOrThrowArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RaffleFindUniqueOrThrowArgs>(args: SelectSubset<T, RaffleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Raffle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindFirstArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RaffleFindFirstArgs>(args?: SelectSubset<T, RaffleFindFirstArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Raffle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindFirstOrThrowArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RaffleFindFirstOrThrowArgs>(args?: SelectSubset<T, RaffleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Raffles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Raffles
     * const raffles = await prisma.raffle.findMany()
     * 
     * // Get first 10 Raffles
     * const raffles = await prisma.raffle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const raffleWithIdOnly = await prisma.raffle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RaffleFindManyArgs>(args?: SelectSubset<T, RaffleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Raffle.
     * @param {RaffleCreateArgs} args - Arguments to create a Raffle.
     * @example
     * // Create one Raffle
     * const Raffle = await prisma.raffle.create({
     *   data: {
     *     // ... data to create a Raffle
     *   }
     * })
     * 
     */
    create<T extends RaffleCreateArgs>(args: SelectSubset<T, RaffleCreateArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Raffles.
     * @param {RaffleCreateManyArgs} args - Arguments to create many Raffles.
     * @example
     * // Create many Raffles
     * const raffle = await prisma.raffle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RaffleCreateManyArgs>(args?: SelectSubset<T, RaffleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Raffles and returns the data saved in the database.
     * @param {RaffleCreateManyAndReturnArgs} args - Arguments to create many Raffles.
     * @example
     * // Create many Raffles
     * const raffle = await prisma.raffle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Raffles and only return the `id`
     * const raffleWithIdOnly = await prisma.raffle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RaffleCreateManyAndReturnArgs>(args?: SelectSubset<T, RaffleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Raffle.
     * @param {RaffleDeleteArgs} args - Arguments to delete one Raffle.
     * @example
     * // Delete one Raffle
     * const Raffle = await prisma.raffle.delete({
     *   where: {
     *     // ... filter to delete one Raffle
     *   }
     * })
     * 
     */
    delete<T extends RaffleDeleteArgs>(args: SelectSubset<T, RaffleDeleteArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Raffle.
     * @param {RaffleUpdateArgs} args - Arguments to update one Raffle.
     * @example
     * // Update one Raffle
     * const raffle = await prisma.raffle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RaffleUpdateArgs>(args: SelectSubset<T, RaffleUpdateArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Raffles.
     * @param {RaffleDeleteManyArgs} args - Arguments to filter Raffles to delete.
     * @example
     * // Delete a few Raffles
     * const { count } = await prisma.raffle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RaffleDeleteManyArgs>(args?: SelectSubset<T, RaffleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Raffles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Raffles
     * const raffle = await prisma.raffle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RaffleUpdateManyArgs>(args: SelectSubset<T, RaffleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Raffles and returns the data updated in the database.
     * @param {RaffleUpdateManyAndReturnArgs} args - Arguments to update many Raffles.
     * @example
     * // Update many Raffles
     * const raffle = await prisma.raffle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Raffles and only return the `id`
     * const raffleWithIdOnly = await prisma.raffle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RaffleUpdateManyAndReturnArgs>(args: SelectSubset<T, RaffleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Raffle.
     * @param {RaffleUpsertArgs} args - Arguments to update or create a Raffle.
     * @example
     * // Update or create a Raffle
     * const raffle = await prisma.raffle.upsert({
     *   create: {
     *     // ... data to create a Raffle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Raffle we want to update
     *   }
     * })
     */
    upsert<T extends RaffleUpsertArgs>(args: SelectSubset<T, RaffleUpsertArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Raffles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleCountArgs} args - Arguments to filter Raffles to count.
     * @example
     * // Count the number of Raffles
     * const count = await prisma.raffle.count({
     *   where: {
     *     // ... the filter for the Raffles we want to count
     *   }
     * })
    **/
    count<T extends RaffleCountArgs>(
      args?: Subset<T, RaffleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RaffleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Raffle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RaffleAggregateArgs>(args: Subset<T, RaffleAggregateArgs>): Prisma.PrismaPromise<GetRaffleAggregateType<T>>

    /**
     * Group by Raffle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RaffleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RaffleGroupByArgs['orderBy'] }
        : { orderBy?: RaffleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RaffleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRaffleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Raffle model
   */
  readonly fields: RaffleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Raffle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RaffleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tickets<T extends Raffle$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, Raffle$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Raffle model
   */
  interface RaffleFieldRefs {
    readonly id: FieldRef<"Raffle", 'Int'>
    readonly name: FieldRef<"Raffle", 'String'>
    readonly description: FieldRef<"Raffle", 'String'>
    readonly image: FieldRef<"Raffle", 'String'>
    readonly ticketPrice: FieldRef<"Raffle", 'Float'>
    readonly totalTickets: FieldRef<"Raffle", 'Int'>
    readonly soldTickets: FieldRef<"Raffle", 'Int'>
    readonly endsAt: FieldRef<"Raffle", 'DateTime'>
    readonly winner: FieldRef<"Raffle", 'String'>
    readonly winnerPickedAt: FieldRef<"Raffle", 'DateTime'>
    readonly createdAt: FieldRef<"Raffle", 'DateTime'>
    readonly updatedAt: FieldRef<"Raffle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Raffle findUnique
   */
  export type RaffleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle findUniqueOrThrow
   */
  export type RaffleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle findFirst
   */
  export type RaffleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Raffles.
     */
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle findFirstOrThrow
   */
  export type RaffleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Raffles.
     */
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle findMany
   */
  export type RaffleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter, which Raffles to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle create
   */
  export type RaffleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * The data needed to create a Raffle.
     */
    data: XOR<RaffleCreateInput, RaffleUncheckedCreateInput>
  }

  /**
   * Raffle createMany
   */
  export type RaffleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Raffles.
     */
    data: RaffleCreateManyInput | RaffleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Raffle createManyAndReturn
   */
  export type RaffleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data used to create many Raffles.
     */
    data: RaffleCreateManyInput | RaffleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Raffle update
   */
  export type RaffleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * The data needed to update a Raffle.
     */
    data: XOR<RaffleUpdateInput, RaffleUncheckedUpdateInput>
    /**
     * Choose, which Raffle to update.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle updateMany
   */
  export type RaffleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Raffles.
     */
    data: XOR<RaffleUpdateManyMutationInput, RaffleUncheckedUpdateManyInput>
    /**
     * Filter which Raffles to update
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to update.
     */
    limit?: number
  }

  /**
   * Raffle updateManyAndReturn
   */
  export type RaffleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data used to update Raffles.
     */
    data: XOR<RaffleUpdateManyMutationInput, RaffleUncheckedUpdateManyInput>
    /**
     * Filter which Raffles to update
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to update.
     */
    limit?: number
  }

  /**
   * Raffle upsert
   */
  export type RaffleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * The filter to search for the Raffle to update in case it exists.
     */
    where: RaffleWhereUniqueInput
    /**
     * In case the Raffle found by the `where` argument doesn't exist, create a new Raffle with this data.
     */
    create: XOR<RaffleCreateInput, RaffleUncheckedCreateInput>
    /**
     * In case the Raffle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RaffleUpdateInput, RaffleUncheckedUpdateInput>
  }

  /**
   * Raffle delete
   */
  export type RaffleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
    /**
     * Filter which Raffle to delete.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle deleteMany
   */
  export type RaffleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Raffles to delete
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to delete.
     */
    limit?: number
  }

  /**
   * Raffle.tickets
   */
  export type Raffle$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    where?: RaffleTicketWhereInput
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    cursor?: RaffleTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RaffleTicketScalarFieldEnum | RaffleTicketScalarFieldEnum[]
  }

  /**
   * Raffle without action
   */
  export type RaffleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleInclude<ExtArgs> | null
  }


  /**
   * Model RaffleTicket
   */

  export type AggregateRaffleTicket = {
    _count: RaffleTicketCountAggregateOutputType | null
    _avg: RaffleTicketAvgAggregateOutputType | null
    _sum: RaffleTicketSumAggregateOutputType | null
    _min: RaffleTicketMinAggregateOutputType | null
    _max: RaffleTicketMaxAggregateOutputType | null
  }

  export type RaffleTicketAvgAggregateOutputType = {
    id: number | null
    raffleId: number | null
    quantity: number | null
  }

  export type RaffleTicketSumAggregateOutputType = {
    id: number | null
    raffleId: number | null
    quantity: number | null
  }

  export type RaffleTicketMinAggregateOutputType = {
    id: number | null
    raffleId: number | null
    walletId: string | null
    quantity: number | null
    purchaseDate: Date | null
  }

  export type RaffleTicketMaxAggregateOutputType = {
    id: number | null
    raffleId: number | null
    walletId: string | null
    quantity: number | null
    purchaseDate: Date | null
  }

  export type RaffleTicketCountAggregateOutputType = {
    id: number
    raffleId: number
    walletId: number
    quantity: number
    purchaseDate: number
    _all: number
  }


  export type RaffleTicketAvgAggregateInputType = {
    id?: true
    raffleId?: true
    quantity?: true
  }

  export type RaffleTicketSumAggregateInputType = {
    id?: true
    raffleId?: true
    quantity?: true
  }

  export type RaffleTicketMinAggregateInputType = {
    id?: true
    raffleId?: true
    walletId?: true
    quantity?: true
    purchaseDate?: true
  }

  export type RaffleTicketMaxAggregateInputType = {
    id?: true
    raffleId?: true
    walletId?: true
    quantity?: true
    purchaseDate?: true
  }

  export type RaffleTicketCountAggregateInputType = {
    id?: true
    raffleId?: true
    walletId?: true
    quantity?: true
    purchaseDate?: true
    _all?: true
  }

  export type RaffleTicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RaffleTicket to aggregate.
     */
    where?: RaffleTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleTickets to fetch.
     */
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RaffleTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RaffleTickets
    **/
    _count?: true | RaffleTicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RaffleTicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RaffleTicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RaffleTicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RaffleTicketMaxAggregateInputType
  }

  export type GetRaffleTicketAggregateType<T extends RaffleTicketAggregateArgs> = {
        [P in keyof T & keyof AggregateRaffleTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRaffleTicket[P]>
      : GetScalarType<T[P], AggregateRaffleTicket[P]>
  }




  export type RaffleTicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleTicketWhereInput
    orderBy?: RaffleTicketOrderByWithAggregationInput | RaffleTicketOrderByWithAggregationInput[]
    by: RaffleTicketScalarFieldEnum[] | RaffleTicketScalarFieldEnum
    having?: RaffleTicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RaffleTicketCountAggregateInputType | true
    _avg?: RaffleTicketAvgAggregateInputType
    _sum?: RaffleTicketSumAggregateInputType
    _min?: RaffleTicketMinAggregateInputType
    _max?: RaffleTicketMaxAggregateInputType
  }

  export type RaffleTicketGroupByOutputType = {
    id: number
    raffleId: number
    walletId: string
    quantity: number
    purchaseDate: Date
    _count: RaffleTicketCountAggregateOutputType | null
    _avg: RaffleTicketAvgAggregateOutputType | null
    _sum: RaffleTicketSumAggregateOutputType | null
    _min: RaffleTicketMinAggregateOutputType | null
    _max: RaffleTicketMaxAggregateOutputType | null
  }

  type GetRaffleTicketGroupByPayload<T extends RaffleTicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RaffleTicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RaffleTicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RaffleTicketGroupByOutputType[P]>
            : GetScalarType<T[P], RaffleTicketGroupByOutputType[P]>
        }
      >
    >


  export type RaffleTicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    raffleId?: boolean
    walletId?: boolean
    quantity?: boolean
    purchaseDate?: boolean
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleTicket"]>

  export type RaffleTicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    raffleId?: boolean
    walletId?: boolean
    quantity?: boolean
    purchaseDate?: boolean
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleTicket"]>

  export type RaffleTicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    raffleId?: boolean
    walletId?: boolean
    quantity?: boolean
    purchaseDate?: boolean
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleTicket"]>

  export type RaffleTicketSelectScalar = {
    id?: boolean
    raffleId?: boolean
    walletId?: boolean
    quantity?: boolean
    purchaseDate?: boolean
  }

  export type RaffleTicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "raffleId" | "walletId" | "quantity" | "purchaseDate", ExtArgs["result"]["raffleTicket"]>
  export type RaffleTicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type RaffleTicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }
  export type RaffleTicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    raffle?: boolean | RaffleDefaultArgs<ExtArgs>
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
  }

  export type $RaffleTicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RaffleTicket"
    objects: {
      raffle: Prisma.$RafflePayload<ExtArgs>
      wallet: Prisma.$WalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      raffleId: number
      walletId: string
      quantity: number
      purchaseDate: Date
    }, ExtArgs["result"]["raffleTicket"]>
    composites: {}
  }

  type RaffleTicketGetPayload<S extends boolean | null | undefined | RaffleTicketDefaultArgs> = $Result.GetResult<Prisma.$RaffleTicketPayload, S>

  type RaffleTicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RaffleTicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RaffleTicketCountAggregateInputType | true
    }

  export interface RaffleTicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RaffleTicket'], meta: { name: 'RaffleTicket' } }
    /**
     * Find zero or one RaffleTicket that matches the filter.
     * @param {RaffleTicketFindUniqueArgs} args - Arguments to find a RaffleTicket
     * @example
     * // Get one RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RaffleTicketFindUniqueArgs>(args: SelectSubset<T, RaffleTicketFindUniqueArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RaffleTicket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RaffleTicketFindUniqueOrThrowArgs} args - Arguments to find a RaffleTicket
     * @example
     * // Get one RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RaffleTicketFindUniqueOrThrowArgs>(args: SelectSubset<T, RaffleTicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RaffleTicket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketFindFirstArgs} args - Arguments to find a RaffleTicket
     * @example
     * // Get one RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RaffleTicketFindFirstArgs>(args?: SelectSubset<T, RaffleTicketFindFirstArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RaffleTicket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketFindFirstOrThrowArgs} args - Arguments to find a RaffleTicket
     * @example
     * // Get one RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RaffleTicketFindFirstOrThrowArgs>(args?: SelectSubset<T, RaffleTicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RaffleTickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RaffleTickets
     * const raffleTickets = await prisma.raffleTicket.findMany()
     * 
     * // Get first 10 RaffleTickets
     * const raffleTickets = await prisma.raffleTicket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const raffleTicketWithIdOnly = await prisma.raffleTicket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RaffleTicketFindManyArgs>(args?: SelectSubset<T, RaffleTicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RaffleTicket.
     * @param {RaffleTicketCreateArgs} args - Arguments to create a RaffleTicket.
     * @example
     * // Create one RaffleTicket
     * const RaffleTicket = await prisma.raffleTicket.create({
     *   data: {
     *     // ... data to create a RaffleTicket
     *   }
     * })
     * 
     */
    create<T extends RaffleTicketCreateArgs>(args: SelectSubset<T, RaffleTicketCreateArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RaffleTickets.
     * @param {RaffleTicketCreateManyArgs} args - Arguments to create many RaffleTickets.
     * @example
     * // Create many RaffleTickets
     * const raffleTicket = await prisma.raffleTicket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RaffleTicketCreateManyArgs>(args?: SelectSubset<T, RaffleTicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RaffleTickets and returns the data saved in the database.
     * @param {RaffleTicketCreateManyAndReturnArgs} args - Arguments to create many RaffleTickets.
     * @example
     * // Create many RaffleTickets
     * const raffleTicket = await prisma.raffleTicket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RaffleTickets and only return the `id`
     * const raffleTicketWithIdOnly = await prisma.raffleTicket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RaffleTicketCreateManyAndReturnArgs>(args?: SelectSubset<T, RaffleTicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RaffleTicket.
     * @param {RaffleTicketDeleteArgs} args - Arguments to delete one RaffleTicket.
     * @example
     * // Delete one RaffleTicket
     * const RaffleTicket = await prisma.raffleTicket.delete({
     *   where: {
     *     // ... filter to delete one RaffleTicket
     *   }
     * })
     * 
     */
    delete<T extends RaffleTicketDeleteArgs>(args: SelectSubset<T, RaffleTicketDeleteArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RaffleTicket.
     * @param {RaffleTicketUpdateArgs} args - Arguments to update one RaffleTicket.
     * @example
     * // Update one RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RaffleTicketUpdateArgs>(args: SelectSubset<T, RaffleTicketUpdateArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RaffleTickets.
     * @param {RaffleTicketDeleteManyArgs} args - Arguments to filter RaffleTickets to delete.
     * @example
     * // Delete a few RaffleTickets
     * const { count } = await prisma.raffleTicket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RaffleTicketDeleteManyArgs>(args?: SelectSubset<T, RaffleTicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RaffleTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RaffleTickets
     * const raffleTicket = await prisma.raffleTicket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RaffleTicketUpdateManyArgs>(args: SelectSubset<T, RaffleTicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RaffleTickets and returns the data updated in the database.
     * @param {RaffleTicketUpdateManyAndReturnArgs} args - Arguments to update many RaffleTickets.
     * @example
     * // Update many RaffleTickets
     * const raffleTicket = await prisma.raffleTicket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RaffleTickets and only return the `id`
     * const raffleTicketWithIdOnly = await prisma.raffleTicket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RaffleTicketUpdateManyAndReturnArgs>(args: SelectSubset<T, RaffleTicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RaffleTicket.
     * @param {RaffleTicketUpsertArgs} args - Arguments to update or create a RaffleTicket.
     * @example
     * // Update or create a RaffleTicket
     * const raffleTicket = await prisma.raffleTicket.upsert({
     *   create: {
     *     // ... data to create a RaffleTicket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RaffleTicket we want to update
     *   }
     * })
     */
    upsert<T extends RaffleTicketUpsertArgs>(args: SelectSubset<T, RaffleTicketUpsertArgs<ExtArgs>>): Prisma__RaffleTicketClient<$Result.GetResult<Prisma.$RaffleTicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RaffleTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketCountArgs} args - Arguments to filter RaffleTickets to count.
     * @example
     * // Count the number of RaffleTickets
     * const count = await prisma.raffleTicket.count({
     *   where: {
     *     // ... the filter for the RaffleTickets we want to count
     *   }
     * })
    **/
    count<T extends RaffleTicketCountArgs>(
      args?: Subset<T, RaffleTicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RaffleTicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RaffleTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RaffleTicketAggregateArgs>(args: Subset<T, RaffleTicketAggregateArgs>): Prisma.PrismaPromise<GetRaffleTicketAggregateType<T>>

    /**
     * Group by RaffleTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleTicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RaffleTicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RaffleTicketGroupByArgs['orderBy'] }
        : { orderBy?: RaffleTicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RaffleTicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRaffleTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RaffleTicket model
   */
  readonly fields: RaffleTicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RaffleTicket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RaffleTicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    raffle<T extends RaffleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RaffleDefaultArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RaffleTicket model
   */
  interface RaffleTicketFieldRefs {
    readonly id: FieldRef<"RaffleTicket", 'Int'>
    readonly raffleId: FieldRef<"RaffleTicket", 'Int'>
    readonly walletId: FieldRef<"RaffleTicket", 'String'>
    readonly quantity: FieldRef<"RaffleTicket", 'Int'>
    readonly purchaseDate: FieldRef<"RaffleTicket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RaffleTicket findUnique
   */
  export type RaffleTicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter, which RaffleTicket to fetch.
     */
    where: RaffleTicketWhereUniqueInput
  }

  /**
   * RaffleTicket findUniqueOrThrow
   */
  export type RaffleTicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter, which RaffleTicket to fetch.
     */
    where: RaffleTicketWhereUniqueInput
  }

  /**
   * RaffleTicket findFirst
   */
  export type RaffleTicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter, which RaffleTicket to fetch.
     */
    where?: RaffleTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleTickets to fetch.
     */
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RaffleTickets.
     */
    cursor?: RaffleTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RaffleTickets.
     */
    distinct?: RaffleTicketScalarFieldEnum | RaffleTicketScalarFieldEnum[]
  }

  /**
   * RaffleTicket findFirstOrThrow
   */
  export type RaffleTicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter, which RaffleTicket to fetch.
     */
    where?: RaffleTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleTickets to fetch.
     */
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RaffleTickets.
     */
    cursor?: RaffleTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RaffleTickets.
     */
    distinct?: RaffleTicketScalarFieldEnum | RaffleTicketScalarFieldEnum[]
  }

  /**
   * RaffleTicket findMany
   */
  export type RaffleTicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter, which RaffleTickets to fetch.
     */
    where?: RaffleTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleTickets to fetch.
     */
    orderBy?: RaffleTicketOrderByWithRelationInput | RaffleTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RaffleTickets.
     */
    cursor?: RaffleTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleTickets.
     */
    skip?: number
    distinct?: RaffleTicketScalarFieldEnum | RaffleTicketScalarFieldEnum[]
  }

  /**
   * RaffleTicket create
   */
  export type RaffleTicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * The data needed to create a RaffleTicket.
     */
    data: XOR<RaffleTicketCreateInput, RaffleTicketUncheckedCreateInput>
  }

  /**
   * RaffleTicket createMany
   */
  export type RaffleTicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RaffleTickets.
     */
    data: RaffleTicketCreateManyInput | RaffleTicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RaffleTicket createManyAndReturn
   */
  export type RaffleTicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * The data used to create many RaffleTickets.
     */
    data: RaffleTicketCreateManyInput | RaffleTicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RaffleTicket update
   */
  export type RaffleTicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * The data needed to update a RaffleTicket.
     */
    data: XOR<RaffleTicketUpdateInput, RaffleTicketUncheckedUpdateInput>
    /**
     * Choose, which RaffleTicket to update.
     */
    where: RaffleTicketWhereUniqueInput
  }

  /**
   * RaffleTicket updateMany
   */
  export type RaffleTicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RaffleTickets.
     */
    data: XOR<RaffleTicketUpdateManyMutationInput, RaffleTicketUncheckedUpdateManyInput>
    /**
     * Filter which RaffleTickets to update
     */
    where?: RaffleTicketWhereInput
    /**
     * Limit how many RaffleTickets to update.
     */
    limit?: number
  }

  /**
   * RaffleTicket updateManyAndReturn
   */
  export type RaffleTicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * The data used to update RaffleTickets.
     */
    data: XOR<RaffleTicketUpdateManyMutationInput, RaffleTicketUncheckedUpdateManyInput>
    /**
     * Filter which RaffleTickets to update
     */
    where?: RaffleTicketWhereInput
    /**
     * Limit how many RaffleTickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RaffleTicket upsert
   */
  export type RaffleTicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * The filter to search for the RaffleTicket to update in case it exists.
     */
    where: RaffleTicketWhereUniqueInput
    /**
     * In case the RaffleTicket found by the `where` argument doesn't exist, create a new RaffleTicket with this data.
     */
    create: XOR<RaffleTicketCreateInput, RaffleTicketUncheckedCreateInput>
    /**
     * In case the RaffleTicket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RaffleTicketUpdateInput, RaffleTicketUncheckedUpdateInput>
  }

  /**
   * RaffleTicket delete
   */
  export type RaffleTicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
    /**
     * Filter which RaffleTicket to delete.
     */
    where: RaffleTicketWhereUniqueInput
  }

  /**
   * RaffleTicket deleteMany
   */
  export type RaffleTicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RaffleTickets to delete
     */
    where?: RaffleTicketWhereInput
    /**
     * Limit how many RaffleTickets to delete.
     */
    limit?: number
  }

  /**
   * RaffleTicket without action
   */
  export type RaffleTicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleTicket
     */
    select?: RaffleTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleTicket
     */
    omit?: RaffleTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleTicketInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WalletScalarFieldEnum: {
    id: 'id',
    address: 'address',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    type: 'type',
    amount: 'amount',
    status: 'status',
    paymentHash: 'paymentHash',
    walletId: 'walletId',
    createdAt: 'createdAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const UserRankingScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    totalWagered: 'totalWagered',
    currentRank: 'currentRank',
    rankProgress: 'rankProgress',
    dailyWager: 'dailyWager',
    weeklyWager: 'weeklyWager',
    monthlyWager: 'monthlyWager',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type UserRankingScalarFieldEnum = (typeof UserRankingScalarFieldEnum)[keyof typeof UserRankingScalarFieldEnum]


  export const GameStatsScalarFieldEnum: {
    id: 'id',
    userRankingId: 'userRankingId',
    chestsPlayed: 'chestsPlayed',
    chestsWon: 'chestsWon',
    chestsWagered: 'chestsWagered',
    coinflipPlayed: 'coinflipPlayed',
    coinflipWon: 'coinflipWon',
    coinflipWagered: 'coinflipWagered',
    rafflesEntered: 'rafflesEntered',
    rafflesWon: 'rafflesWon',
    rafflesWagered: 'rafflesWagered',
    lastUpdated: 'lastUpdated'
  };

  export type GameStatsScalarFieldEnum = (typeof GameStatsScalarFieldEnum)[keyof typeof GameStatsScalarFieldEnum]


  export const RewardClaimScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    rewardType: 'rewardType',
    amount: 'amount',
    status: 'status',
    period: 'period',
    description: 'description',
    createdAt: 'createdAt',
    claimedAt: 'claimedAt'
  };

  export type RewardClaimScalarFieldEnum = (typeof RewardClaimScalarFieldEnum)[keyof typeof RewardClaimScalarFieldEnum]


  export const JackpotScalarFieldEnum: {
    id: 'id',
    balance: 'balance',
    totalContributions: 'totalContributions',
    lastWinner: 'lastWinner',
    lastWinAmount: 'lastWinAmount',
    lastWinDate: 'lastWinDate',
    lastUpdate: 'lastUpdate'
  };

  export type JackpotScalarFieldEnum = (typeof JackpotScalarFieldEnum)[keyof typeof JackpotScalarFieldEnum]


  export const RaffleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    image: 'image',
    ticketPrice: 'ticketPrice',
    totalTickets: 'totalTickets',
    soldTickets: 'soldTickets',
    endsAt: 'endsAt',
    winner: 'winner',
    winnerPickedAt: 'winnerPickedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RaffleScalarFieldEnum = (typeof RaffleScalarFieldEnum)[keyof typeof RaffleScalarFieldEnum]


  export const RaffleTicketScalarFieldEnum: {
    id: 'id',
    raffleId: 'raffleId',
    walletId: 'walletId',
    quantity: 'quantity',
    purchaseDate: 'purchaseDate'
  };

  export type RaffleTicketScalarFieldEnum = (typeof RaffleTicketScalarFieldEnum)[keyof typeof RaffleTicketScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'RewardType'
   */
  export type EnumRewardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RewardType'>
    


  /**
   * Reference to a field of type 'RewardType[]'
   */
  export type ListEnumRewardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RewardType[]'>
    


  /**
   * Reference to a field of type 'ClaimStatus'
   */
  export type EnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus'>
    


  /**
   * Reference to a field of type 'ClaimStatus[]'
   */
  export type ListEnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type WalletWhereInput = {
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    id?: StringFilter<"Wallet"> | string
    address?: StringFilter<"Wallet"> | string
    balance?: FloatFilter<"Wallet"> | number
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    transactions?: TransactionListRelationFilter
    userRanking?: XOR<UserRankingNullableScalarRelationFilter, UserRankingWhereInput> | null
    rewardClaims?: RewardClaimListRelationFilter
    raffleTickets?: RaffleTicketListRelationFilter
  }

  export type WalletOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactions?: TransactionOrderByRelationAggregateInput
    userRanking?: UserRankingOrderByWithRelationInput
    rewardClaims?: RewardClaimOrderByRelationAggregateInput
    raffleTickets?: RaffleTicketOrderByRelationAggregateInput
  }

  export type WalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    address?: string
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    balance?: FloatFilter<"Wallet"> | number
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    transactions?: TransactionListRelationFilter
    userRanking?: XOR<UserRankingNullableScalarRelationFilter, UserRankingWhereInput> | null
    rewardClaims?: RewardClaimListRelationFilter
    raffleTickets?: RaffleTicketListRelationFilter
  }, "id" | "address">

  export type WalletOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WalletCountOrderByAggregateInput
    _avg?: WalletAvgOrderByAggregateInput
    _max?: WalletMaxOrderByAggregateInput
    _min?: WalletMinOrderByAggregateInput
    _sum?: WalletSumOrderByAggregateInput
  }

  export type WalletScalarWhereWithAggregatesInput = {
    AND?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    OR?: WalletScalarWhereWithAggregatesInput[]
    NOT?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wallet"> | string
    address?: StringWithAggregatesFilter<"Wallet"> | string
    balance?: FloatWithAggregatesFilter<"Wallet"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: FloatFilter<"Transaction"> | number
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    paymentHash?: StringNullableFilter<"Transaction"> | string | null
    walletId?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentHash?: SortOrderInput | SortOrder
    walletId?: SortOrder
    createdAt?: SortOrder
    wallet?: WalletOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: FloatFilter<"Transaction"> | number
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    paymentHash?: StringNullableFilter<"Transaction"> | string | null
    walletId?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentHash?: SortOrderInput | SortOrder
    walletId?: SortOrder
    createdAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"Transaction"> | $Enums.TransactionType
    amount?: FloatWithAggregatesFilter<"Transaction"> | number
    status?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus
    paymentHash?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    walletId?: StringWithAggregatesFilter<"Transaction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type UserRankingWhereInput = {
    AND?: UserRankingWhereInput | UserRankingWhereInput[]
    OR?: UserRankingWhereInput[]
    NOT?: UserRankingWhereInput | UserRankingWhereInput[]
    id?: StringFilter<"UserRanking"> | string
    walletId?: StringFilter<"UserRanking"> | string
    totalWagered?: FloatFilter<"UserRanking"> | number
    currentRank?: StringFilter<"UserRanking"> | string
    rankProgress?: IntFilter<"UserRanking"> | number
    dailyWager?: FloatFilter<"UserRanking"> | number
    weeklyWager?: FloatFilter<"UserRanking"> | number
    monthlyWager?: FloatFilter<"UserRanking"> | number
    lastUpdated?: DateTimeFilter<"UserRanking"> | Date | string
    createdAt?: DateTimeFilter<"UserRanking"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    gameStats?: XOR<GameStatsNullableScalarRelationFilter, GameStatsWhereInput> | null
  }

  export type UserRankingOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    totalWagered?: SortOrder
    currentRank?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    wallet?: WalletOrderByWithRelationInput
    gameStats?: GameStatsOrderByWithRelationInput
  }

  export type UserRankingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    walletId?: string
    AND?: UserRankingWhereInput | UserRankingWhereInput[]
    OR?: UserRankingWhereInput[]
    NOT?: UserRankingWhereInput | UserRankingWhereInput[]
    totalWagered?: FloatFilter<"UserRanking"> | number
    currentRank?: StringFilter<"UserRanking"> | string
    rankProgress?: IntFilter<"UserRanking"> | number
    dailyWager?: FloatFilter<"UserRanking"> | number
    weeklyWager?: FloatFilter<"UserRanking"> | number
    monthlyWager?: FloatFilter<"UserRanking"> | number
    lastUpdated?: DateTimeFilter<"UserRanking"> | Date | string
    createdAt?: DateTimeFilter<"UserRanking"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    gameStats?: XOR<GameStatsNullableScalarRelationFilter, GameStatsWhereInput> | null
  }, "id" | "walletId">

  export type UserRankingOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    totalWagered?: SortOrder
    currentRank?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: UserRankingCountOrderByAggregateInput
    _avg?: UserRankingAvgOrderByAggregateInput
    _max?: UserRankingMaxOrderByAggregateInput
    _min?: UserRankingMinOrderByAggregateInput
    _sum?: UserRankingSumOrderByAggregateInput
  }

  export type UserRankingScalarWhereWithAggregatesInput = {
    AND?: UserRankingScalarWhereWithAggregatesInput | UserRankingScalarWhereWithAggregatesInput[]
    OR?: UserRankingScalarWhereWithAggregatesInput[]
    NOT?: UserRankingScalarWhereWithAggregatesInput | UserRankingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserRanking"> | string
    walletId?: StringWithAggregatesFilter<"UserRanking"> | string
    totalWagered?: FloatWithAggregatesFilter<"UserRanking"> | number
    currentRank?: StringWithAggregatesFilter<"UserRanking"> | string
    rankProgress?: IntWithAggregatesFilter<"UserRanking"> | number
    dailyWager?: FloatWithAggregatesFilter<"UserRanking"> | number
    weeklyWager?: FloatWithAggregatesFilter<"UserRanking"> | number
    monthlyWager?: FloatWithAggregatesFilter<"UserRanking"> | number
    lastUpdated?: DateTimeWithAggregatesFilter<"UserRanking"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserRanking"> | Date | string
  }

  export type GameStatsWhereInput = {
    AND?: GameStatsWhereInput | GameStatsWhereInput[]
    OR?: GameStatsWhereInput[]
    NOT?: GameStatsWhereInput | GameStatsWhereInput[]
    id?: StringFilter<"GameStats"> | string
    userRankingId?: StringFilter<"GameStats"> | string
    chestsPlayed?: IntFilter<"GameStats"> | number
    chestsWon?: IntFilter<"GameStats"> | number
    chestsWagered?: FloatFilter<"GameStats"> | number
    coinflipPlayed?: IntFilter<"GameStats"> | number
    coinflipWon?: IntFilter<"GameStats"> | number
    coinflipWagered?: FloatFilter<"GameStats"> | number
    rafflesEntered?: IntFilter<"GameStats"> | number
    rafflesWon?: IntFilter<"GameStats"> | number
    rafflesWagered?: FloatFilter<"GameStats"> | number
    lastUpdated?: DateTimeFilter<"GameStats"> | Date | string
    userRanking?: XOR<UserRankingScalarRelationFilter, UserRankingWhereInput>
  }

  export type GameStatsOrderByWithRelationInput = {
    id?: SortOrder
    userRankingId?: SortOrder
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
    lastUpdated?: SortOrder
    userRanking?: UserRankingOrderByWithRelationInput
  }

  export type GameStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userRankingId?: string
    AND?: GameStatsWhereInput | GameStatsWhereInput[]
    OR?: GameStatsWhereInput[]
    NOT?: GameStatsWhereInput | GameStatsWhereInput[]
    chestsPlayed?: IntFilter<"GameStats"> | number
    chestsWon?: IntFilter<"GameStats"> | number
    chestsWagered?: FloatFilter<"GameStats"> | number
    coinflipPlayed?: IntFilter<"GameStats"> | number
    coinflipWon?: IntFilter<"GameStats"> | number
    coinflipWagered?: FloatFilter<"GameStats"> | number
    rafflesEntered?: IntFilter<"GameStats"> | number
    rafflesWon?: IntFilter<"GameStats"> | number
    rafflesWagered?: FloatFilter<"GameStats"> | number
    lastUpdated?: DateTimeFilter<"GameStats"> | Date | string
    userRanking?: XOR<UserRankingScalarRelationFilter, UserRankingWhereInput>
  }, "id" | "userRankingId">

  export type GameStatsOrderByWithAggregationInput = {
    id?: SortOrder
    userRankingId?: SortOrder
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
    lastUpdated?: SortOrder
    _count?: GameStatsCountOrderByAggregateInput
    _avg?: GameStatsAvgOrderByAggregateInput
    _max?: GameStatsMaxOrderByAggregateInput
    _min?: GameStatsMinOrderByAggregateInput
    _sum?: GameStatsSumOrderByAggregateInput
  }

  export type GameStatsScalarWhereWithAggregatesInput = {
    AND?: GameStatsScalarWhereWithAggregatesInput | GameStatsScalarWhereWithAggregatesInput[]
    OR?: GameStatsScalarWhereWithAggregatesInput[]
    NOT?: GameStatsScalarWhereWithAggregatesInput | GameStatsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameStats"> | string
    userRankingId?: StringWithAggregatesFilter<"GameStats"> | string
    chestsPlayed?: IntWithAggregatesFilter<"GameStats"> | number
    chestsWon?: IntWithAggregatesFilter<"GameStats"> | number
    chestsWagered?: FloatWithAggregatesFilter<"GameStats"> | number
    coinflipPlayed?: IntWithAggregatesFilter<"GameStats"> | number
    coinflipWon?: IntWithAggregatesFilter<"GameStats"> | number
    coinflipWagered?: FloatWithAggregatesFilter<"GameStats"> | number
    rafflesEntered?: IntWithAggregatesFilter<"GameStats"> | number
    rafflesWon?: IntWithAggregatesFilter<"GameStats"> | number
    rafflesWagered?: FloatWithAggregatesFilter<"GameStats"> | number
    lastUpdated?: DateTimeWithAggregatesFilter<"GameStats"> | Date | string
  }

  export type RewardClaimWhereInput = {
    AND?: RewardClaimWhereInput | RewardClaimWhereInput[]
    OR?: RewardClaimWhereInput[]
    NOT?: RewardClaimWhereInput | RewardClaimWhereInput[]
    id?: StringFilter<"RewardClaim"> | string
    walletId?: StringFilter<"RewardClaim"> | string
    rewardType?: EnumRewardTypeFilter<"RewardClaim"> | $Enums.RewardType
    amount?: FloatFilter<"RewardClaim"> | number
    status?: EnumClaimStatusFilter<"RewardClaim"> | $Enums.ClaimStatus
    period?: StringFilter<"RewardClaim"> | string
    description?: StringFilter<"RewardClaim"> | string
    createdAt?: DateTimeFilter<"RewardClaim"> | Date | string
    claimedAt?: DateTimeNullableFilter<"RewardClaim"> | Date | string | null
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }

  export type RewardClaimOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    rewardType?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    period?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    claimedAt?: SortOrderInput | SortOrder
    wallet?: WalletOrderByWithRelationInput
  }

  export type RewardClaimWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RewardClaimWhereInput | RewardClaimWhereInput[]
    OR?: RewardClaimWhereInput[]
    NOT?: RewardClaimWhereInput | RewardClaimWhereInput[]
    walletId?: StringFilter<"RewardClaim"> | string
    rewardType?: EnumRewardTypeFilter<"RewardClaim"> | $Enums.RewardType
    amount?: FloatFilter<"RewardClaim"> | number
    status?: EnumClaimStatusFilter<"RewardClaim"> | $Enums.ClaimStatus
    period?: StringFilter<"RewardClaim"> | string
    description?: StringFilter<"RewardClaim"> | string
    createdAt?: DateTimeFilter<"RewardClaim"> | Date | string
    claimedAt?: DateTimeNullableFilter<"RewardClaim"> | Date | string | null
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }, "id">

  export type RewardClaimOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    rewardType?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    period?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    claimedAt?: SortOrderInput | SortOrder
    _count?: RewardClaimCountOrderByAggregateInput
    _avg?: RewardClaimAvgOrderByAggregateInput
    _max?: RewardClaimMaxOrderByAggregateInput
    _min?: RewardClaimMinOrderByAggregateInput
    _sum?: RewardClaimSumOrderByAggregateInput
  }

  export type RewardClaimScalarWhereWithAggregatesInput = {
    AND?: RewardClaimScalarWhereWithAggregatesInput | RewardClaimScalarWhereWithAggregatesInput[]
    OR?: RewardClaimScalarWhereWithAggregatesInput[]
    NOT?: RewardClaimScalarWhereWithAggregatesInput | RewardClaimScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RewardClaim"> | string
    walletId?: StringWithAggregatesFilter<"RewardClaim"> | string
    rewardType?: EnumRewardTypeWithAggregatesFilter<"RewardClaim"> | $Enums.RewardType
    amount?: FloatWithAggregatesFilter<"RewardClaim"> | number
    status?: EnumClaimStatusWithAggregatesFilter<"RewardClaim"> | $Enums.ClaimStatus
    period?: StringWithAggregatesFilter<"RewardClaim"> | string
    description?: StringWithAggregatesFilter<"RewardClaim"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RewardClaim"> | Date | string
    claimedAt?: DateTimeNullableWithAggregatesFilter<"RewardClaim"> | Date | string | null
  }

  export type JackpotWhereInput = {
    AND?: JackpotWhereInput | JackpotWhereInput[]
    OR?: JackpotWhereInput[]
    NOT?: JackpotWhereInput | JackpotWhereInput[]
    id?: IntFilter<"Jackpot"> | number
    balance?: FloatFilter<"Jackpot"> | number
    totalContributions?: FloatFilter<"Jackpot"> | number
    lastWinner?: StringNullableFilter<"Jackpot"> | string | null
    lastWinAmount?: FloatNullableFilter<"Jackpot"> | number | null
    lastWinDate?: DateTimeNullableFilter<"Jackpot"> | Date | string | null
    lastUpdate?: DateTimeFilter<"Jackpot"> | Date | string
  }

  export type JackpotOrderByWithRelationInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinner?: SortOrderInput | SortOrder
    lastWinAmount?: SortOrderInput | SortOrder
    lastWinDate?: SortOrderInput | SortOrder
    lastUpdate?: SortOrder
  }

  export type JackpotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: JackpotWhereInput | JackpotWhereInput[]
    OR?: JackpotWhereInput[]
    NOT?: JackpotWhereInput | JackpotWhereInput[]
    balance?: FloatFilter<"Jackpot"> | number
    totalContributions?: FloatFilter<"Jackpot"> | number
    lastWinner?: StringNullableFilter<"Jackpot"> | string | null
    lastWinAmount?: FloatNullableFilter<"Jackpot"> | number | null
    lastWinDate?: DateTimeNullableFilter<"Jackpot"> | Date | string | null
    lastUpdate?: DateTimeFilter<"Jackpot"> | Date | string
  }, "id">

  export type JackpotOrderByWithAggregationInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinner?: SortOrderInput | SortOrder
    lastWinAmount?: SortOrderInput | SortOrder
    lastWinDate?: SortOrderInput | SortOrder
    lastUpdate?: SortOrder
    _count?: JackpotCountOrderByAggregateInput
    _avg?: JackpotAvgOrderByAggregateInput
    _max?: JackpotMaxOrderByAggregateInput
    _min?: JackpotMinOrderByAggregateInput
    _sum?: JackpotSumOrderByAggregateInput
  }

  export type JackpotScalarWhereWithAggregatesInput = {
    AND?: JackpotScalarWhereWithAggregatesInput | JackpotScalarWhereWithAggregatesInput[]
    OR?: JackpotScalarWhereWithAggregatesInput[]
    NOT?: JackpotScalarWhereWithAggregatesInput | JackpotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Jackpot"> | number
    balance?: FloatWithAggregatesFilter<"Jackpot"> | number
    totalContributions?: FloatWithAggregatesFilter<"Jackpot"> | number
    lastWinner?: StringNullableWithAggregatesFilter<"Jackpot"> | string | null
    lastWinAmount?: FloatNullableWithAggregatesFilter<"Jackpot"> | number | null
    lastWinDate?: DateTimeNullableWithAggregatesFilter<"Jackpot"> | Date | string | null
    lastUpdate?: DateTimeWithAggregatesFilter<"Jackpot"> | Date | string
  }

  export type RaffleWhereInput = {
    AND?: RaffleWhereInput | RaffleWhereInput[]
    OR?: RaffleWhereInput[]
    NOT?: RaffleWhereInput | RaffleWhereInput[]
    id?: IntFilter<"Raffle"> | number
    name?: StringFilter<"Raffle"> | string
    description?: StringFilter<"Raffle"> | string
    image?: StringFilter<"Raffle"> | string
    ticketPrice?: FloatFilter<"Raffle"> | number
    totalTickets?: IntFilter<"Raffle"> | number
    soldTickets?: IntFilter<"Raffle"> | number
    endsAt?: DateTimeFilter<"Raffle"> | Date | string
    winner?: StringNullableFilter<"Raffle"> | string | null
    winnerPickedAt?: DateTimeNullableFilter<"Raffle"> | Date | string | null
    createdAt?: DateTimeFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeFilter<"Raffle"> | Date | string
    tickets?: RaffleTicketListRelationFilter
  }

  export type RaffleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
    endsAt?: SortOrder
    winner?: SortOrderInput | SortOrder
    winnerPickedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tickets?: RaffleTicketOrderByRelationAggregateInput
  }

  export type RaffleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RaffleWhereInput | RaffleWhereInput[]
    OR?: RaffleWhereInput[]
    NOT?: RaffleWhereInput | RaffleWhereInput[]
    name?: StringFilter<"Raffle"> | string
    description?: StringFilter<"Raffle"> | string
    image?: StringFilter<"Raffle"> | string
    ticketPrice?: FloatFilter<"Raffle"> | number
    totalTickets?: IntFilter<"Raffle"> | number
    soldTickets?: IntFilter<"Raffle"> | number
    endsAt?: DateTimeFilter<"Raffle"> | Date | string
    winner?: StringNullableFilter<"Raffle"> | string | null
    winnerPickedAt?: DateTimeNullableFilter<"Raffle"> | Date | string | null
    createdAt?: DateTimeFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeFilter<"Raffle"> | Date | string
    tickets?: RaffleTicketListRelationFilter
  }, "id">

  export type RaffleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
    endsAt?: SortOrder
    winner?: SortOrderInput | SortOrder
    winnerPickedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RaffleCountOrderByAggregateInput
    _avg?: RaffleAvgOrderByAggregateInput
    _max?: RaffleMaxOrderByAggregateInput
    _min?: RaffleMinOrderByAggregateInput
    _sum?: RaffleSumOrderByAggregateInput
  }

  export type RaffleScalarWhereWithAggregatesInput = {
    AND?: RaffleScalarWhereWithAggregatesInput | RaffleScalarWhereWithAggregatesInput[]
    OR?: RaffleScalarWhereWithAggregatesInput[]
    NOT?: RaffleScalarWhereWithAggregatesInput | RaffleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Raffle"> | number
    name?: StringWithAggregatesFilter<"Raffle"> | string
    description?: StringWithAggregatesFilter<"Raffle"> | string
    image?: StringWithAggregatesFilter<"Raffle"> | string
    ticketPrice?: FloatWithAggregatesFilter<"Raffle"> | number
    totalTickets?: IntWithAggregatesFilter<"Raffle"> | number
    soldTickets?: IntWithAggregatesFilter<"Raffle"> | number
    endsAt?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
    winner?: StringNullableWithAggregatesFilter<"Raffle"> | string | null
    winnerPickedAt?: DateTimeNullableWithAggregatesFilter<"Raffle"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
  }

  export type RaffleTicketWhereInput = {
    AND?: RaffleTicketWhereInput | RaffleTicketWhereInput[]
    OR?: RaffleTicketWhereInput[]
    NOT?: RaffleTicketWhereInput | RaffleTicketWhereInput[]
    id?: IntFilter<"RaffleTicket"> | number
    raffleId?: IntFilter<"RaffleTicket"> | number
    walletId?: StringFilter<"RaffleTicket"> | string
    quantity?: IntFilter<"RaffleTicket"> | number
    purchaseDate?: DateTimeFilter<"RaffleTicket"> | Date | string
    raffle?: XOR<RaffleScalarRelationFilter, RaffleWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }

  export type RaffleTicketOrderByWithRelationInput = {
    id?: SortOrder
    raffleId?: SortOrder
    walletId?: SortOrder
    quantity?: SortOrder
    purchaseDate?: SortOrder
    raffle?: RaffleOrderByWithRelationInput
    wallet?: WalletOrderByWithRelationInput
  }

  export type RaffleTicketWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RaffleTicketWhereInput | RaffleTicketWhereInput[]
    OR?: RaffleTicketWhereInput[]
    NOT?: RaffleTicketWhereInput | RaffleTicketWhereInput[]
    raffleId?: IntFilter<"RaffleTicket"> | number
    walletId?: StringFilter<"RaffleTicket"> | string
    quantity?: IntFilter<"RaffleTicket"> | number
    purchaseDate?: DateTimeFilter<"RaffleTicket"> | Date | string
    raffle?: XOR<RaffleScalarRelationFilter, RaffleWhereInput>
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
  }, "id">

  export type RaffleTicketOrderByWithAggregationInput = {
    id?: SortOrder
    raffleId?: SortOrder
    walletId?: SortOrder
    quantity?: SortOrder
    purchaseDate?: SortOrder
    _count?: RaffleTicketCountOrderByAggregateInput
    _avg?: RaffleTicketAvgOrderByAggregateInput
    _max?: RaffleTicketMaxOrderByAggregateInput
    _min?: RaffleTicketMinOrderByAggregateInput
    _sum?: RaffleTicketSumOrderByAggregateInput
  }

  export type RaffleTicketScalarWhereWithAggregatesInput = {
    AND?: RaffleTicketScalarWhereWithAggregatesInput | RaffleTicketScalarWhereWithAggregatesInput[]
    OR?: RaffleTicketScalarWhereWithAggregatesInput[]
    NOT?: RaffleTicketScalarWhereWithAggregatesInput | RaffleTicketScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RaffleTicket"> | number
    raffleId?: IntWithAggregatesFilter<"RaffleTicket"> | number
    walletId?: StringWithAggregatesFilter<"RaffleTicket"> | string
    quantity?: IntWithAggregatesFilter<"RaffleTicket"> | number
    purchaseDate?: DateTimeWithAggregatesFilter<"RaffleTicket"> | Date | string
  }

  export type WalletCreateInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingUncheckedCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimUncheckedCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUncheckedUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUncheckedUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type WalletCreateManyInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    walletId: string
    createdAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    walletId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    walletId: string
    createdAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    walletId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRankingCreateInput = {
    id?: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutUserRankingInput
    gameStats?: GameStatsCreateNestedOneWithoutUserRankingInput
  }

  export type UserRankingUncheckedCreateInput = {
    id?: string
    walletId: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    gameStats?: GameStatsUncheckedCreateNestedOneWithoutUserRankingInput
  }

  export type UserRankingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutUserRankingNestedInput
    gameStats?: GameStatsUpdateOneWithoutUserRankingNestedInput
  }

  export type UserRankingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gameStats?: GameStatsUncheckedUpdateOneWithoutUserRankingNestedInput
  }

  export type UserRankingCreateManyInput = {
    id?: string
    walletId: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UserRankingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRankingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameStatsCreateInput = {
    id?: string
    chestsPlayed?: number
    chestsWon?: number
    chestsWagered?: number
    coinflipPlayed?: number
    coinflipWon?: number
    coinflipWagered?: number
    rafflesEntered?: number
    rafflesWon?: number
    rafflesWagered?: number
    lastUpdated?: Date | string
    userRanking: UserRankingCreateNestedOneWithoutGameStatsInput
  }

  export type GameStatsUncheckedCreateInput = {
    id?: string
    userRankingId: string
    chestsPlayed?: number
    chestsWon?: number
    chestsWagered?: number
    coinflipPlayed?: number
    coinflipWon?: number
    coinflipWagered?: number
    rafflesEntered?: number
    rafflesWon?: number
    rafflesWagered?: number
    lastUpdated?: Date | string
  }

  export type GameStatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    userRanking?: UserRankingUpdateOneRequiredWithoutGameStatsNestedInput
  }

  export type GameStatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userRankingId?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameStatsCreateManyInput = {
    id?: string
    userRankingId: string
    chestsPlayed?: number
    chestsWon?: number
    chestsWagered?: number
    coinflipPlayed?: number
    coinflipWon?: number
    coinflipWagered?: number
    rafflesEntered?: number
    rafflesWon?: number
    rafflesWagered?: number
    lastUpdated?: Date | string
  }

  export type GameStatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameStatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userRankingId?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardClaimCreateInput = {
    id?: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
    wallet: WalletCreateNestedOneWithoutRewardClaimsInput
  }

  export type RewardClaimUncheckedCreateInput = {
    id?: string
    walletId: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
  }

  export type RewardClaimUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneRequiredWithoutRewardClaimsNestedInput
  }

  export type RewardClaimUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RewardClaimCreateManyInput = {
    id?: string
    walletId: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
  }

  export type RewardClaimUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RewardClaimUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JackpotCreateInput = {
    id?: number
    balance?: number
    totalContributions?: number
    lastWinner?: string | null
    lastWinAmount?: number | null
    lastWinDate?: Date | string | null
    lastUpdate?: Date | string
  }

  export type JackpotUncheckedCreateInput = {
    id?: number
    balance?: number
    totalContributions?: number
    lastWinner?: string | null
    lastWinAmount?: number | null
    lastWinDate?: Date | string | null
    lastUpdate?: Date | string
  }

  export type JackpotUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    balance?: FloatFieldUpdateOperationsInput | number
    totalContributions?: FloatFieldUpdateOperationsInput | number
    lastWinner?: NullableStringFieldUpdateOperationsInput | string | null
    lastWinAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    lastWinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JackpotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    balance?: FloatFieldUpdateOperationsInput | number
    totalContributions?: FloatFieldUpdateOperationsInput | number
    lastWinner?: NullableStringFieldUpdateOperationsInput | string | null
    lastWinAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    lastWinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JackpotCreateManyInput = {
    id?: number
    balance?: number
    totalContributions?: number
    lastWinner?: string | null
    lastWinAmount?: number | null
    lastWinDate?: Date | string | null
    lastUpdate?: Date | string
  }

  export type JackpotUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    balance?: FloatFieldUpdateOperationsInput | number
    totalContributions?: FloatFieldUpdateOperationsInput | number
    lastWinner?: NullableStringFieldUpdateOperationsInput | string | null
    lastWinAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    lastWinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JackpotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    balance?: FloatFieldUpdateOperationsInput | number
    totalContributions?: FloatFieldUpdateOperationsInput | number
    lastWinner?: NullableStringFieldUpdateOperationsInput | string | null
    lastWinAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    lastWinDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleCreateInput = {
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets?: number
    endsAt: Date | string
    winner?: string | null
    winnerPickedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: RaffleTicketCreateNestedManyWithoutRaffleInput
  }

  export type RaffleUncheckedCreateInput = {
    id?: number
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets?: number
    endsAt: Date | string
    winner?: string | null
    winnerPickedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: RaffleTicketUncheckedCreateNestedManyWithoutRaffleInput
  }

  export type RaffleUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: RaffleTicketUpdateManyWithoutRaffleNestedInput
  }

  export type RaffleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: RaffleTicketUncheckedUpdateManyWithoutRaffleNestedInput
  }

  export type RaffleCreateManyInput = {
    id?: number
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets?: number
    endsAt: Date | string
    winner?: string | null
    winnerPickedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketCreateInput = {
    quantity?: number
    purchaseDate?: Date | string
    raffle: RaffleCreateNestedOneWithoutTicketsInput
    wallet: WalletCreateNestedOneWithoutRaffleTicketsInput
  }

  export type RaffleTicketUncheckedCreateInput = {
    id?: number
    raffleId: number
    walletId: string
    quantity?: number
    purchaseDate?: Date | string
  }

  export type RaffleTicketUpdateInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    raffle?: RaffleUpdateOneRequiredWithoutTicketsNestedInput
    wallet?: WalletUpdateOneRequiredWithoutRaffleTicketsNestedInput
  }

  export type RaffleTicketUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    raffleId?: IntFieldUpdateOperationsInput | number
    walletId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketCreateManyInput = {
    id?: number
    raffleId: number
    walletId: string
    quantity?: number
    purchaseDate?: Date | string
  }

  export type RaffleTicketUpdateManyMutationInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    raffleId?: IntFieldUpdateOperationsInput | number
    walletId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type UserRankingNullableScalarRelationFilter = {
    is?: UserRankingWhereInput | null
    isNot?: UserRankingWhereInput | null
  }

  export type RewardClaimListRelationFilter = {
    every?: RewardClaimWhereInput
    some?: RewardClaimWhereInput
    none?: RewardClaimWhereInput
  }

  export type RaffleTicketListRelationFilter = {
    every?: RaffleTicketWhereInput
    some?: RaffleTicketWhereInput
    none?: RaffleTicketWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RewardClaimOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RaffleTicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WalletCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type WalletMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type WalletScalarRelationFilter = {
    is?: WalletWhereInput
    isNot?: WalletWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentHash?: SortOrder
    walletId?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentHash?: SortOrder
    walletId?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentHash?: SortOrder
    walletId?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type GameStatsNullableScalarRelationFilter = {
    is?: GameStatsWhereInput | null
    isNot?: GameStatsWhereInput | null
  }

  export type UserRankingCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    totalWagered?: SortOrder
    currentRank?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UserRankingAvgOrderByAggregateInput = {
    totalWagered?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
  }

  export type UserRankingMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    totalWagered?: SortOrder
    currentRank?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UserRankingMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    totalWagered?: SortOrder
    currentRank?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UserRankingSumOrderByAggregateInput = {
    totalWagered?: SortOrder
    rankProgress?: SortOrder
    dailyWager?: SortOrder
    weeklyWager?: SortOrder
    monthlyWager?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserRankingScalarRelationFilter = {
    is?: UserRankingWhereInput
    isNot?: UserRankingWhereInput
  }

  export type GameStatsCountOrderByAggregateInput = {
    id?: SortOrder
    userRankingId?: SortOrder
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
    lastUpdated?: SortOrder
  }

  export type GameStatsAvgOrderByAggregateInput = {
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
  }

  export type GameStatsMaxOrderByAggregateInput = {
    id?: SortOrder
    userRankingId?: SortOrder
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
    lastUpdated?: SortOrder
  }

  export type GameStatsMinOrderByAggregateInput = {
    id?: SortOrder
    userRankingId?: SortOrder
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
    lastUpdated?: SortOrder
  }

  export type GameStatsSumOrderByAggregateInput = {
    chestsPlayed?: SortOrder
    chestsWon?: SortOrder
    chestsWagered?: SortOrder
    coinflipPlayed?: SortOrder
    coinflipWon?: SortOrder
    coinflipWagered?: SortOrder
    rafflesEntered?: SortOrder
    rafflesWon?: SortOrder
    rafflesWagered?: SortOrder
  }

  export type EnumRewardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RewardType | EnumRewardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRewardTypeFilter<$PrismaModel> | $Enums.RewardType
  }

  export type EnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RewardClaimCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    rewardType?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    period?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    claimedAt?: SortOrder
  }

  export type RewardClaimAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type RewardClaimMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    rewardType?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    period?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    claimedAt?: SortOrder
  }

  export type RewardClaimMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    rewardType?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    period?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    claimedAt?: SortOrder
  }

  export type RewardClaimSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumRewardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RewardType | EnumRewardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRewardTypeWithAggregatesFilter<$PrismaModel> | $Enums.RewardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRewardTypeFilter<$PrismaModel>
    _max?: NestedEnumRewardTypeFilter<$PrismaModel>
  }

  export type EnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type JackpotCountOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinner?: SortOrder
    lastWinAmount?: SortOrder
    lastWinDate?: SortOrder
    lastUpdate?: SortOrder
  }

  export type JackpotAvgOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinAmount?: SortOrder
  }

  export type JackpotMaxOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinner?: SortOrder
    lastWinAmount?: SortOrder
    lastWinDate?: SortOrder
    lastUpdate?: SortOrder
  }

  export type JackpotMinOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinner?: SortOrder
    lastWinAmount?: SortOrder
    lastWinDate?: SortOrder
    lastUpdate?: SortOrder
  }

  export type JackpotSumOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    totalContributions?: SortOrder
    lastWinAmount?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type RaffleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
    endsAt?: SortOrder
    winner?: SortOrder
    winnerPickedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleAvgOrderByAggregateInput = {
    id?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
  }

  export type RaffleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
    endsAt?: SortOrder
    winner?: SortOrder
    winnerPickedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
    endsAt?: SortOrder
    winner?: SortOrder
    winnerPickedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleSumOrderByAggregateInput = {
    id?: SortOrder
    ticketPrice?: SortOrder
    totalTickets?: SortOrder
    soldTickets?: SortOrder
  }

  export type RaffleScalarRelationFilter = {
    is?: RaffleWhereInput
    isNot?: RaffleWhereInput
  }

  export type RaffleTicketCountOrderByAggregateInput = {
    id?: SortOrder
    raffleId?: SortOrder
    walletId?: SortOrder
    quantity?: SortOrder
    purchaseDate?: SortOrder
  }

  export type RaffleTicketAvgOrderByAggregateInput = {
    id?: SortOrder
    raffleId?: SortOrder
    quantity?: SortOrder
  }

  export type RaffleTicketMaxOrderByAggregateInput = {
    id?: SortOrder
    raffleId?: SortOrder
    walletId?: SortOrder
    quantity?: SortOrder
    purchaseDate?: SortOrder
  }

  export type RaffleTicketMinOrderByAggregateInput = {
    id?: SortOrder
    raffleId?: SortOrder
    walletId?: SortOrder
    quantity?: SortOrder
    purchaseDate?: SortOrder
  }

  export type RaffleTicketSumOrderByAggregateInput = {
    id?: SortOrder
    raffleId?: SortOrder
    quantity?: SortOrder
  }

  export type TransactionCreateNestedManyWithoutWalletInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type UserRankingCreateNestedOneWithoutWalletInput = {
    create?: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutWalletInput
    connect?: UserRankingWhereUniqueInput
  }

  export type RewardClaimCreateNestedManyWithoutWalletInput = {
    create?: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput> | RewardClaimCreateWithoutWalletInput[] | RewardClaimUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RewardClaimCreateOrConnectWithoutWalletInput | RewardClaimCreateOrConnectWithoutWalletInput[]
    createMany?: RewardClaimCreateManyWalletInputEnvelope
    connect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
  }

  export type RaffleTicketCreateNestedManyWithoutWalletInput = {
    create?: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput> | RaffleTicketCreateWithoutWalletInput[] | RaffleTicketUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutWalletInput | RaffleTicketCreateOrConnectWithoutWalletInput[]
    createMany?: RaffleTicketCreateManyWalletInputEnvelope
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type UserRankingUncheckedCreateNestedOneWithoutWalletInput = {
    create?: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutWalletInput
    connect?: UserRankingWhereUniqueInput
  }

  export type RewardClaimUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput> | RewardClaimCreateWithoutWalletInput[] | RewardClaimUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RewardClaimCreateOrConnectWithoutWalletInput | RewardClaimCreateOrConnectWithoutWalletInput[]
    createMany?: RewardClaimCreateManyWalletInputEnvelope
    connect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
  }

  export type RaffleTicketUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput> | RaffleTicketCreateWithoutWalletInput[] | RaffleTicketUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutWalletInput | RaffleTicketCreateOrConnectWithoutWalletInput[]
    createMany?: RaffleTicketCreateManyWalletInputEnvelope
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransactionUpdateManyWithoutWalletNestedInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutWalletInput | TransactionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutWalletInput | TransactionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutWalletInput | TransactionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserRankingUpdateOneWithoutWalletNestedInput = {
    create?: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutWalletInput
    upsert?: UserRankingUpsertWithoutWalletInput
    disconnect?: UserRankingWhereInput | boolean
    delete?: UserRankingWhereInput | boolean
    connect?: UserRankingWhereUniqueInput
    update?: XOR<XOR<UserRankingUpdateToOneWithWhereWithoutWalletInput, UserRankingUpdateWithoutWalletInput>, UserRankingUncheckedUpdateWithoutWalletInput>
  }

  export type RewardClaimUpdateManyWithoutWalletNestedInput = {
    create?: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput> | RewardClaimCreateWithoutWalletInput[] | RewardClaimUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RewardClaimCreateOrConnectWithoutWalletInput | RewardClaimCreateOrConnectWithoutWalletInput[]
    upsert?: RewardClaimUpsertWithWhereUniqueWithoutWalletInput | RewardClaimUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: RewardClaimCreateManyWalletInputEnvelope
    set?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    disconnect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    delete?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    connect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    update?: RewardClaimUpdateWithWhereUniqueWithoutWalletInput | RewardClaimUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: RewardClaimUpdateManyWithWhereWithoutWalletInput | RewardClaimUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: RewardClaimScalarWhereInput | RewardClaimScalarWhereInput[]
  }

  export type RaffleTicketUpdateManyWithoutWalletNestedInput = {
    create?: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput> | RaffleTicketCreateWithoutWalletInput[] | RaffleTicketUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutWalletInput | RaffleTicketCreateOrConnectWithoutWalletInput[]
    upsert?: RaffleTicketUpsertWithWhereUniqueWithoutWalletInput | RaffleTicketUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: RaffleTicketCreateManyWalletInputEnvelope
    set?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    disconnect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    delete?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    update?: RaffleTicketUpdateWithWhereUniqueWithoutWalletInput | RaffleTicketUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: RaffleTicketUpdateManyWithWhereWithoutWalletInput | RaffleTicketUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput> | TransactionCreateWithoutWalletInput[] | TransactionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutWalletInput | TransactionCreateOrConnectWithoutWalletInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutWalletInput | TransactionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: TransactionCreateManyWalletInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutWalletInput | TransactionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutWalletInput | TransactionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserRankingUncheckedUpdateOneWithoutWalletNestedInput = {
    create?: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutWalletInput
    upsert?: UserRankingUpsertWithoutWalletInput
    disconnect?: UserRankingWhereInput | boolean
    delete?: UserRankingWhereInput | boolean
    connect?: UserRankingWhereUniqueInput
    update?: XOR<XOR<UserRankingUpdateToOneWithWhereWithoutWalletInput, UserRankingUpdateWithoutWalletInput>, UserRankingUncheckedUpdateWithoutWalletInput>
  }

  export type RewardClaimUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput> | RewardClaimCreateWithoutWalletInput[] | RewardClaimUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RewardClaimCreateOrConnectWithoutWalletInput | RewardClaimCreateOrConnectWithoutWalletInput[]
    upsert?: RewardClaimUpsertWithWhereUniqueWithoutWalletInput | RewardClaimUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: RewardClaimCreateManyWalletInputEnvelope
    set?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    disconnect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    delete?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    connect?: RewardClaimWhereUniqueInput | RewardClaimWhereUniqueInput[]
    update?: RewardClaimUpdateWithWhereUniqueWithoutWalletInput | RewardClaimUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: RewardClaimUpdateManyWithWhereWithoutWalletInput | RewardClaimUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: RewardClaimScalarWhereInput | RewardClaimScalarWhereInput[]
  }

  export type RaffleTicketUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput> | RaffleTicketCreateWithoutWalletInput[] | RaffleTicketUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutWalletInput | RaffleTicketCreateOrConnectWithoutWalletInput[]
    upsert?: RaffleTicketUpsertWithWhereUniqueWithoutWalletInput | RaffleTicketUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: RaffleTicketCreateManyWalletInputEnvelope
    set?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    disconnect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    delete?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    update?: RaffleTicketUpdateWithWhereUniqueWithoutWalletInput | RaffleTicketUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: RaffleTicketUpdateManyWithWhereWithoutWalletInput | RaffleTicketUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
  }

  export type WalletCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutTransactionsInput
    connect?: WalletWhereUniqueInput
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type WalletUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutTransactionsInput
    upsert?: WalletUpsertWithoutTransactionsInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutTransactionsInput, WalletUpdateWithoutTransactionsInput>, WalletUncheckedUpdateWithoutTransactionsInput>
  }

  export type WalletCreateNestedOneWithoutUserRankingInput = {
    create?: XOR<WalletCreateWithoutUserRankingInput, WalletUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserRankingInput
    connect?: WalletWhereUniqueInput
  }

  export type GameStatsCreateNestedOneWithoutUserRankingInput = {
    create?: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: GameStatsCreateOrConnectWithoutUserRankingInput
    connect?: GameStatsWhereUniqueInput
  }

  export type GameStatsUncheckedCreateNestedOneWithoutUserRankingInput = {
    create?: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: GameStatsCreateOrConnectWithoutUserRankingInput
    connect?: GameStatsWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WalletUpdateOneRequiredWithoutUserRankingNestedInput = {
    create?: XOR<WalletCreateWithoutUserRankingInput, WalletUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserRankingInput
    upsert?: WalletUpsertWithoutUserRankingInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutUserRankingInput, WalletUpdateWithoutUserRankingInput>, WalletUncheckedUpdateWithoutUserRankingInput>
  }

  export type GameStatsUpdateOneWithoutUserRankingNestedInput = {
    create?: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: GameStatsCreateOrConnectWithoutUserRankingInput
    upsert?: GameStatsUpsertWithoutUserRankingInput
    disconnect?: GameStatsWhereInput | boolean
    delete?: GameStatsWhereInput | boolean
    connect?: GameStatsWhereUniqueInput
    update?: XOR<XOR<GameStatsUpdateToOneWithWhereWithoutUserRankingInput, GameStatsUpdateWithoutUserRankingInput>, GameStatsUncheckedUpdateWithoutUserRankingInput>
  }

  export type GameStatsUncheckedUpdateOneWithoutUserRankingNestedInput = {
    create?: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
    connectOrCreate?: GameStatsCreateOrConnectWithoutUserRankingInput
    upsert?: GameStatsUpsertWithoutUserRankingInput
    disconnect?: GameStatsWhereInput | boolean
    delete?: GameStatsWhereInput | boolean
    connect?: GameStatsWhereUniqueInput
    update?: XOR<XOR<GameStatsUpdateToOneWithWhereWithoutUserRankingInput, GameStatsUpdateWithoutUserRankingInput>, GameStatsUncheckedUpdateWithoutUserRankingInput>
  }

  export type UserRankingCreateNestedOneWithoutGameStatsInput = {
    create?: XOR<UserRankingCreateWithoutGameStatsInput, UserRankingUncheckedCreateWithoutGameStatsInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutGameStatsInput
    connect?: UserRankingWhereUniqueInput
  }

  export type UserRankingUpdateOneRequiredWithoutGameStatsNestedInput = {
    create?: XOR<UserRankingCreateWithoutGameStatsInput, UserRankingUncheckedCreateWithoutGameStatsInput>
    connectOrCreate?: UserRankingCreateOrConnectWithoutGameStatsInput
    upsert?: UserRankingUpsertWithoutGameStatsInput
    connect?: UserRankingWhereUniqueInput
    update?: XOR<XOR<UserRankingUpdateToOneWithWhereWithoutGameStatsInput, UserRankingUpdateWithoutGameStatsInput>, UserRankingUncheckedUpdateWithoutGameStatsInput>
  }

  export type WalletCreateNestedOneWithoutRewardClaimsInput = {
    create?: XOR<WalletCreateWithoutRewardClaimsInput, WalletUncheckedCreateWithoutRewardClaimsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutRewardClaimsInput
    connect?: WalletWhereUniqueInput
  }

  export type EnumRewardTypeFieldUpdateOperationsInput = {
    set?: $Enums.RewardType
  }

  export type EnumClaimStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClaimStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WalletUpdateOneRequiredWithoutRewardClaimsNestedInput = {
    create?: XOR<WalletCreateWithoutRewardClaimsInput, WalletUncheckedCreateWithoutRewardClaimsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutRewardClaimsInput
    upsert?: WalletUpsertWithoutRewardClaimsInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutRewardClaimsInput, WalletUpdateWithoutRewardClaimsInput>, WalletUncheckedUpdateWithoutRewardClaimsInput>
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RaffleTicketCreateNestedManyWithoutRaffleInput = {
    create?: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput> | RaffleTicketCreateWithoutRaffleInput[] | RaffleTicketUncheckedCreateWithoutRaffleInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutRaffleInput | RaffleTicketCreateOrConnectWithoutRaffleInput[]
    createMany?: RaffleTicketCreateManyRaffleInputEnvelope
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
  }

  export type RaffleTicketUncheckedCreateNestedManyWithoutRaffleInput = {
    create?: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput> | RaffleTicketCreateWithoutRaffleInput[] | RaffleTicketUncheckedCreateWithoutRaffleInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutRaffleInput | RaffleTicketCreateOrConnectWithoutRaffleInput[]
    createMany?: RaffleTicketCreateManyRaffleInputEnvelope
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
  }

  export type RaffleTicketUpdateManyWithoutRaffleNestedInput = {
    create?: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput> | RaffleTicketCreateWithoutRaffleInput[] | RaffleTicketUncheckedCreateWithoutRaffleInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutRaffleInput | RaffleTicketCreateOrConnectWithoutRaffleInput[]
    upsert?: RaffleTicketUpsertWithWhereUniqueWithoutRaffleInput | RaffleTicketUpsertWithWhereUniqueWithoutRaffleInput[]
    createMany?: RaffleTicketCreateManyRaffleInputEnvelope
    set?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    disconnect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    delete?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    update?: RaffleTicketUpdateWithWhereUniqueWithoutRaffleInput | RaffleTicketUpdateWithWhereUniqueWithoutRaffleInput[]
    updateMany?: RaffleTicketUpdateManyWithWhereWithoutRaffleInput | RaffleTicketUpdateManyWithWhereWithoutRaffleInput[]
    deleteMany?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
  }

  export type RaffleTicketUncheckedUpdateManyWithoutRaffleNestedInput = {
    create?: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput> | RaffleTicketCreateWithoutRaffleInput[] | RaffleTicketUncheckedCreateWithoutRaffleInput[]
    connectOrCreate?: RaffleTicketCreateOrConnectWithoutRaffleInput | RaffleTicketCreateOrConnectWithoutRaffleInput[]
    upsert?: RaffleTicketUpsertWithWhereUniqueWithoutRaffleInput | RaffleTicketUpsertWithWhereUniqueWithoutRaffleInput[]
    createMany?: RaffleTicketCreateManyRaffleInputEnvelope
    set?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    disconnect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    delete?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    connect?: RaffleTicketWhereUniqueInput | RaffleTicketWhereUniqueInput[]
    update?: RaffleTicketUpdateWithWhereUniqueWithoutRaffleInput | RaffleTicketUpdateWithWhereUniqueWithoutRaffleInput[]
    updateMany?: RaffleTicketUpdateManyWithWhereWithoutRaffleInput | RaffleTicketUpdateManyWithWhereWithoutRaffleInput[]
    deleteMany?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
  }

  export type RaffleCreateNestedOneWithoutTicketsInput = {
    create?: XOR<RaffleCreateWithoutTicketsInput, RaffleUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: RaffleCreateOrConnectWithoutTicketsInput
    connect?: RaffleWhereUniqueInput
  }

  export type WalletCreateNestedOneWithoutRaffleTicketsInput = {
    create?: XOR<WalletCreateWithoutRaffleTicketsInput, WalletUncheckedCreateWithoutRaffleTicketsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutRaffleTicketsInput
    connect?: WalletWhereUniqueInput
  }

  export type RaffleUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<RaffleCreateWithoutTicketsInput, RaffleUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: RaffleCreateOrConnectWithoutTicketsInput
    upsert?: RaffleUpsertWithoutTicketsInput
    connect?: RaffleWhereUniqueInput
    update?: XOR<XOR<RaffleUpdateToOneWithWhereWithoutTicketsInput, RaffleUpdateWithoutTicketsInput>, RaffleUncheckedUpdateWithoutTicketsInput>
  }

  export type WalletUpdateOneRequiredWithoutRaffleTicketsNestedInput = {
    create?: XOR<WalletCreateWithoutRaffleTicketsInput, WalletUncheckedCreateWithoutRaffleTicketsInput>
    connectOrCreate?: WalletCreateOrConnectWithoutRaffleTicketsInput
    upsert?: WalletUpsertWithoutRaffleTicketsInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutRaffleTicketsInput, WalletUpdateWithoutRaffleTicketsInput>, WalletUncheckedUpdateWithoutRaffleTicketsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumRewardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RewardType | EnumRewardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRewardTypeFilter<$PrismaModel> | $Enums.RewardType
  }

  export type NestedEnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRewardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RewardType | EnumRewardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RewardType[] | ListEnumRewardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRewardTypeWithAggregatesFilter<$PrismaModel> | $Enums.RewardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRewardTypeFilter<$PrismaModel>
    _max?: NestedEnumRewardTypeFilter<$PrismaModel>
  }

  export type NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type TransactionCreateWithoutWalletInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    createdAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutWalletInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    createdAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput>
  }

  export type TransactionCreateManyWalletInputEnvelope = {
    data: TransactionCreateManyWalletInput | TransactionCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type UserRankingCreateWithoutWalletInput = {
    id?: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    gameStats?: GameStatsCreateNestedOneWithoutUserRankingInput
  }

  export type UserRankingUncheckedCreateWithoutWalletInput = {
    id?: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    gameStats?: GameStatsUncheckedCreateNestedOneWithoutUserRankingInput
  }

  export type UserRankingCreateOrConnectWithoutWalletInput = {
    where: UserRankingWhereUniqueInput
    create: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
  }

  export type RewardClaimCreateWithoutWalletInput = {
    id?: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
  }

  export type RewardClaimUncheckedCreateWithoutWalletInput = {
    id?: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
  }

  export type RewardClaimCreateOrConnectWithoutWalletInput = {
    where: RewardClaimWhereUniqueInput
    create: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput>
  }

  export type RewardClaimCreateManyWalletInputEnvelope = {
    data: RewardClaimCreateManyWalletInput | RewardClaimCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type RaffleTicketCreateWithoutWalletInput = {
    quantity?: number
    purchaseDate?: Date | string
    raffle: RaffleCreateNestedOneWithoutTicketsInput
  }

  export type RaffleTicketUncheckedCreateWithoutWalletInput = {
    id?: number
    raffleId: number
    quantity?: number
    purchaseDate?: Date | string
  }

  export type RaffleTicketCreateOrConnectWithoutWalletInput = {
    where: RaffleTicketWhereUniqueInput
    create: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput>
  }

  export type RaffleTicketCreateManyWalletInputEnvelope = {
    data: RaffleTicketCreateManyWalletInput | RaffleTicketCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutWalletInput, TransactionUncheckedUpdateWithoutWalletInput>
    create: XOR<TransactionCreateWithoutWalletInput, TransactionUncheckedCreateWithoutWalletInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutWalletInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutWalletInput, TransactionUncheckedUpdateWithoutWalletInput>
  }

  export type TransactionUpdateManyWithWhereWithoutWalletInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutWalletInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amount?: FloatFilter<"Transaction"> | number
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    paymentHash?: StringNullableFilter<"Transaction"> | string | null
    walletId?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type UserRankingUpsertWithoutWalletInput = {
    update: XOR<UserRankingUpdateWithoutWalletInput, UserRankingUncheckedUpdateWithoutWalletInput>
    create: XOR<UserRankingCreateWithoutWalletInput, UserRankingUncheckedCreateWithoutWalletInput>
    where?: UserRankingWhereInput
  }

  export type UserRankingUpdateToOneWithWhereWithoutWalletInput = {
    where?: UserRankingWhereInput
    data: XOR<UserRankingUpdateWithoutWalletInput, UserRankingUncheckedUpdateWithoutWalletInput>
  }

  export type UserRankingUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gameStats?: GameStatsUpdateOneWithoutUserRankingNestedInput
  }

  export type UserRankingUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gameStats?: GameStatsUncheckedUpdateOneWithoutUserRankingNestedInput
  }

  export type RewardClaimUpsertWithWhereUniqueWithoutWalletInput = {
    where: RewardClaimWhereUniqueInput
    update: XOR<RewardClaimUpdateWithoutWalletInput, RewardClaimUncheckedUpdateWithoutWalletInput>
    create: XOR<RewardClaimCreateWithoutWalletInput, RewardClaimUncheckedCreateWithoutWalletInput>
  }

  export type RewardClaimUpdateWithWhereUniqueWithoutWalletInput = {
    where: RewardClaimWhereUniqueInput
    data: XOR<RewardClaimUpdateWithoutWalletInput, RewardClaimUncheckedUpdateWithoutWalletInput>
  }

  export type RewardClaimUpdateManyWithWhereWithoutWalletInput = {
    where: RewardClaimScalarWhereInput
    data: XOR<RewardClaimUpdateManyMutationInput, RewardClaimUncheckedUpdateManyWithoutWalletInput>
  }

  export type RewardClaimScalarWhereInput = {
    AND?: RewardClaimScalarWhereInput | RewardClaimScalarWhereInput[]
    OR?: RewardClaimScalarWhereInput[]
    NOT?: RewardClaimScalarWhereInput | RewardClaimScalarWhereInput[]
    id?: StringFilter<"RewardClaim"> | string
    walletId?: StringFilter<"RewardClaim"> | string
    rewardType?: EnumRewardTypeFilter<"RewardClaim"> | $Enums.RewardType
    amount?: FloatFilter<"RewardClaim"> | number
    status?: EnumClaimStatusFilter<"RewardClaim"> | $Enums.ClaimStatus
    period?: StringFilter<"RewardClaim"> | string
    description?: StringFilter<"RewardClaim"> | string
    createdAt?: DateTimeFilter<"RewardClaim"> | Date | string
    claimedAt?: DateTimeNullableFilter<"RewardClaim"> | Date | string | null
  }

  export type RaffleTicketUpsertWithWhereUniqueWithoutWalletInput = {
    where: RaffleTicketWhereUniqueInput
    update: XOR<RaffleTicketUpdateWithoutWalletInput, RaffleTicketUncheckedUpdateWithoutWalletInput>
    create: XOR<RaffleTicketCreateWithoutWalletInput, RaffleTicketUncheckedCreateWithoutWalletInput>
  }

  export type RaffleTicketUpdateWithWhereUniqueWithoutWalletInput = {
    where: RaffleTicketWhereUniqueInput
    data: XOR<RaffleTicketUpdateWithoutWalletInput, RaffleTicketUncheckedUpdateWithoutWalletInput>
  }

  export type RaffleTicketUpdateManyWithWhereWithoutWalletInput = {
    where: RaffleTicketScalarWhereInput
    data: XOR<RaffleTicketUpdateManyMutationInput, RaffleTicketUncheckedUpdateManyWithoutWalletInput>
  }

  export type RaffleTicketScalarWhereInput = {
    AND?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
    OR?: RaffleTicketScalarWhereInput[]
    NOT?: RaffleTicketScalarWhereInput | RaffleTicketScalarWhereInput[]
    id?: IntFilter<"RaffleTicket"> | number
    raffleId?: IntFilter<"RaffleTicket"> | number
    walletId?: StringFilter<"RaffleTicket"> | string
    quantity?: IntFilter<"RaffleTicket"> | number
    purchaseDate?: DateTimeFilter<"RaffleTicket"> | Date | string
  }

  export type WalletCreateWithoutTransactionsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    userRanking?: UserRankingCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutTransactionsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    userRanking?: UserRankingUncheckedCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimUncheckedCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutTransactionsInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
  }

  export type WalletUpsertWithoutTransactionsInput = {
    update: XOR<WalletUpdateWithoutTransactionsInput, WalletUncheckedUpdateWithoutTransactionsInput>
    create: XOR<WalletCreateWithoutTransactionsInput, WalletUncheckedCreateWithoutTransactionsInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutTransactionsInput, WalletUncheckedUpdateWithoutTransactionsInput>
  }

  export type WalletUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userRanking?: UserRankingUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userRanking?: UserRankingUncheckedUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUncheckedUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type WalletCreateWithoutUserRankingInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    rewardClaims?: RewardClaimCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutUserRankingInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    rewardClaims?: RewardClaimUncheckedCreateNestedManyWithoutWalletInput
    raffleTickets?: RaffleTicketUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutUserRankingInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutUserRankingInput, WalletUncheckedCreateWithoutUserRankingInput>
  }

  export type GameStatsCreateWithoutUserRankingInput = {
    id?: string
    chestsPlayed?: number
    chestsWon?: number
    chestsWagered?: number
    coinflipPlayed?: number
    coinflipWon?: number
    coinflipWagered?: number
    rafflesEntered?: number
    rafflesWon?: number
    rafflesWagered?: number
    lastUpdated?: Date | string
  }

  export type GameStatsUncheckedCreateWithoutUserRankingInput = {
    id?: string
    chestsPlayed?: number
    chestsWon?: number
    chestsWagered?: number
    coinflipPlayed?: number
    coinflipWon?: number
    coinflipWagered?: number
    rafflesEntered?: number
    rafflesWon?: number
    rafflesWagered?: number
    lastUpdated?: Date | string
  }

  export type GameStatsCreateOrConnectWithoutUserRankingInput = {
    where: GameStatsWhereUniqueInput
    create: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
  }

  export type WalletUpsertWithoutUserRankingInput = {
    update: XOR<WalletUpdateWithoutUserRankingInput, WalletUncheckedUpdateWithoutUserRankingInput>
    create: XOR<WalletCreateWithoutUserRankingInput, WalletUncheckedCreateWithoutUserRankingInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutUserRankingInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutUserRankingInput, WalletUncheckedUpdateWithoutUserRankingInput>
  }

  export type WalletUpdateWithoutUserRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    rewardClaims?: RewardClaimUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutUserRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    rewardClaims?: RewardClaimUncheckedUpdateManyWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type GameStatsUpsertWithoutUserRankingInput = {
    update: XOR<GameStatsUpdateWithoutUserRankingInput, GameStatsUncheckedUpdateWithoutUserRankingInput>
    create: XOR<GameStatsCreateWithoutUserRankingInput, GameStatsUncheckedCreateWithoutUserRankingInput>
    where?: GameStatsWhereInput
  }

  export type GameStatsUpdateToOneWithWhereWithoutUserRankingInput = {
    where?: GameStatsWhereInput
    data: XOR<GameStatsUpdateWithoutUserRankingInput, GameStatsUncheckedUpdateWithoutUserRankingInput>
  }

  export type GameStatsUpdateWithoutUserRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameStatsUncheckedUpdateWithoutUserRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    chestsPlayed?: IntFieldUpdateOperationsInput | number
    chestsWon?: IntFieldUpdateOperationsInput | number
    chestsWagered?: FloatFieldUpdateOperationsInput | number
    coinflipPlayed?: IntFieldUpdateOperationsInput | number
    coinflipWon?: IntFieldUpdateOperationsInput | number
    coinflipWagered?: FloatFieldUpdateOperationsInput | number
    rafflesEntered?: IntFieldUpdateOperationsInput | number
    rafflesWon?: IntFieldUpdateOperationsInput | number
    rafflesWagered?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRankingCreateWithoutGameStatsInput = {
    id?: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    wallet: WalletCreateNestedOneWithoutUserRankingInput
  }

  export type UserRankingUncheckedCreateWithoutGameStatsInput = {
    id?: string
    walletId: string
    totalWagered?: number
    currentRank?: string
    rankProgress?: number
    dailyWager?: number
    weeklyWager?: number
    monthlyWager?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UserRankingCreateOrConnectWithoutGameStatsInput = {
    where: UserRankingWhereUniqueInput
    create: XOR<UserRankingCreateWithoutGameStatsInput, UserRankingUncheckedCreateWithoutGameStatsInput>
  }

  export type UserRankingUpsertWithoutGameStatsInput = {
    update: XOR<UserRankingUpdateWithoutGameStatsInput, UserRankingUncheckedUpdateWithoutGameStatsInput>
    create: XOR<UserRankingCreateWithoutGameStatsInput, UserRankingUncheckedCreateWithoutGameStatsInput>
    where?: UserRankingWhereInput
  }

  export type UserRankingUpdateToOneWithWhereWithoutGameStatsInput = {
    where?: UserRankingWhereInput
    data: XOR<UserRankingUpdateWithoutGameStatsInput, UserRankingUncheckedUpdateWithoutGameStatsInput>
  }

  export type UserRankingUpdateWithoutGameStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutUserRankingNestedInput
  }

  export type UserRankingUncheckedUpdateWithoutGameStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    totalWagered?: FloatFieldUpdateOperationsInput | number
    currentRank?: StringFieldUpdateOperationsInput | string
    rankProgress?: IntFieldUpdateOperationsInput | number
    dailyWager?: FloatFieldUpdateOperationsInput | number
    weeklyWager?: FloatFieldUpdateOperationsInput | number
    monthlyWager?: FloatFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletCreateWithoutRewardClaimsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingCreateNestedOneWithoutWalletInput
    raffleTickets?: RaffleTicketCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutRewardClaimsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingUncheckedCreateNestedOneWithoutWalletInput
    raffleTickets?: RaffleTicketUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutRewardClaimsInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutRewardClaimsInput, WalletUncheckedCreateWithoutRewardClaimsInput>
  }

  export type WalletUpsertWithoutRewardClaimsInput = {
    update: XOR<WalletUpdateWithoutRewardClaimsInput, WalletUncheckedUpdateWithoutRewardClaimsInput>
    create: XOR<WalletCreateWithoutRewardClaimsInput, WalletUncheckedCreateWithoutRewardClaimsInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutRewardClaimsInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutRewardClaimsInput, WalletUncheckedUpdateWithoutRewardClaimsInput>
  }

  export type WalletUpdateWithoutRewardClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUpdateOneWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutRewardClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUncheckedUpdateOneWithoutWalletNestedInput
    raffleTickets?: RaffleTicketUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type RaffleTicketCreateWithoutRaffleInput = {
    quantity?: number
    purchaseDate?: Date | string
    wallet: WalletCreateNestedOneWithoutRaffleTicketsInput
  }

  export type RaffleTicketUncheckedCreateWithoutRaffleInput = {
    id?: number
    walletId: string
    quantity?: number
    purchaseDate?: Date | string
  }

  export type RaffleTicketCreateOrConnectWithoutRaffleInput = {
    where: RaffleTicketWhereUniqueInput
    create: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput>
  }

  export type RaffleTicketCreateManyRaffleInputEnvelope = {
    data: RaffleTicketCreateManyRaffleInput | RaffleTicketCreateManyRaffleInput[]
    skipDuplicates?: boolean
  }

  export type RaffleTicketUpsertWithWhereUniqueWithoutRaffleInput = {
    where: RaffleTicketWhereUniqueInput
    update: XOR<RaffleTicketUpdateWithoutRaffleInput, RaffleTicketUncheckedUpdateWithoutRaffleInput>
    create: XOR<RaffleTicketCreateWithoutRaffleInput, RaffleTicketUncheckedCreateWithoutRaffleInput>
  }

  export type RaffleTicketUpdateWithWhereUniqueWithoutRaffleInput = {
    where: RaffleTicketWhereUniqueInput
    data: XOR<RaffleTicketUpdateWithoutRaffleInput, RaffleTicketUncheckedUpdateWithoutRaffleInput>
  }

  export type RaffleTicketUpdateManyWithWhereWithoutRaffleInput = {
    where: RaffleTicketScalarWhereInput
    data: XOR<RaffleTicketUpdateManyMutationInput, RaffleTicketUncheckedUpdateManyWithoutRaffleInput>
  }

  export type RaffleCreateWithoutTicketsInput = {
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets?: number
    endsAt: Date | string
    winner?: string | null
    winnerPickedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleUncheckedCreateWithoutTicketsInput = {
    id?: number
    name: string
    description: string
    image: string
    ticketPrice: number
    totalTickets: number
    soldTickets?: number
    endsAt: Date | string
    winner?: string | null
    winnerPickedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleCreateOrConnectWithoutTicketsInput = {
    where: RaffleWhereUniqueInput
    create: XOR<RaffleCreateWithoutTicketsInput, RaffleUncheckedCreateWithoutTicketsInput>
  }

  export type WalletCreateWithoutRaffleTicketsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutRaffleTicketsInput = {
    id?: string
    address: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutWalletInput
    userRanking?: UserRankingUncheckedCreateNestedOneWithoutWalletInput
    rewardClaims?: RewardClaimUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutRaffleTicketsInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutRaffleTicketsInput, WalletUncheckedCreateWithoutRaffleTicketsInput>
  }

  export type RaffleUpsertWithoutTicketsInput = {
    update: XOR<RaffleUpdateWithoutTicketsInput, RaffleUncheckedUpdateWithoutTicketsInput>
    create: XOR<RaffleCreateWithoutTicketsInput, RaffleUncheckedCreateWithoutTicketsInput>
    where?: RaffleWhereInput
  }

  export type RaffleUpdateToOneWithWhereWithoutTicketsInput = {
    where?: RaffleWhereInput
    data: XOR<RaffleUpdateWithoutTicketsInput, RaffleUncheckedUpdateWithoutTicketsInput>
  }

  export type RaffleUpdateWithoutTicketsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleUncheckedUpdateWithoutTicketsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    ticketPrice?: FloatFieldUpdateOperationsInput | number
    totalTickets?: IntFieldUpdateOperationsInput | number
    soldTickets?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    winnerPickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUpsertWithoutRaffleTicketsInput = {
    update: XOR<WalletUpdateWithoutRaffleTicketsInput, WalletUncheckedUpdateWithoutRaffleTicketsInput>
    create: XOR<WalletCreateWithoutRaffleTicketsInput, WalletUncheckedCreateWithoutRaffleTicketsInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutRaffleTicketsInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutRaffleTicketsInput, WalletUncheckedUpdateWithoutRaffleTicketsInput>
  }

  export type WalletUpdateWithoutRaffleTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutRaffleTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutWalletNestedInput
    userRanking?: UserRankingUncheckedUpdateOneWithoutWalletNestedInput
    rewardClaims?: RewardClaimUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type TransactionCreateManyWalletInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    status?: $Enums.TransactionStatus
    paymentHash?: string | null
    createdAt?: Date | string
  }

  export type RewardClaimCreateManyWalletInput = {
    id?: string
    rewardType: $Enums.RewardType
    amount: number
    status?: $Enums.ClaimStatus
    period: string
    description: string
    createdAt?: Date | string
    claimedAt?: Date | string | null
  }

  export type RaffleTicketCreateManyWalletInput = {
    id?: number
    raffleId: number
    quantity?: number
    purchaseDate?: Date | string
  }

  export type TransactionUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    paymentHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RewardClaimUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RewardClaimUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RewardClaimUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    rewardType?: EnumRewardTypeFieldUpdateOperationsInput | $Enums.RewardType
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    period?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RaffleTicketUpdateWithoutWalletInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    raffle?: RaffleUpdateOneRequiredWithoutTicketsNestedInput
  }

  export type RaffleTicketUncheckedUpdateWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    raffleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketUncheckedUpdateManyWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    raffleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketCreateManyRaffleInput = {
    id?: number
    walletId: string
    quantity?: number
    purchaseDate?: Date | string
  }

  export type RaffleTicketUpdateWithoutRaffleInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutRaffleTicketsNestedInput
  }

  export type RaffleTicketUncheckedUpdateWithoutRaffleInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleTicketUncheckedUpdateManyWithoutRaffleInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}