import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

(actor {
  // Service A: Token Service
  type Token = {
    id : Nat;
    name : Text;
    symbol : Text;
    price : Float;
  };

  let tokens = Map.empty<Nat, Token>();
  tokens.add(
    0,
    {
      id = 0;
      name = "DCSS";
      symbol = "DCSS";
      price = 0.85;
    },
  );
  tokens.add(
    1,
    {
      id = 1;
      name = "Internet Computer Protocol";
      symbol = "ICP";
      price = 12.50;
    },
  );
  tokens.add(
    2,
    {
      id = 2;
      name = "Ethereum";
      symbol = "ETH";
      price = 3200.0;
    },
  );
  tokens.add(
    3,
    {
      id = 3;
      name = "Bitcoin";
      symbol = "BTC";
      price = 67000.0;
    },
  );
  tokens.add(
    4,
    {
      id = 4;
      name = "Solana";
      symbol = "SOL";
      price = 180.0;
    },
  );
  tokens.add(
    5,
    {
      id = 5;
      name = "Avalanche";
      symbol = "AVAX";
      price = 38.0;
    },
  );
  tokens.add(
    6,
    {
      id = 6;
      name = "Near";
      symbol = "NEAR";
      price = 7.0;
    },
  );
  tokens.add(
    7,
    {
      id = 7;
      name = "Arbitrum";
      symbol = "ARB";
      price = 1.2;
    },
  );
  tokens.add(
    8,
    {
      id = 8;
      name = "Base";
      symbol = "BASE";
      price = 0.95;
    },
  );
  tokens.add(
    9,
    {
      id = 9;
      name = "ChainLink";
      symbol = "LINK";
      price = 18.0;
    },
  );
  tokens.add(
    10,
    {
      id = 10;
      name = "Polkadot";
      symbol = "DOT";
      price = 9.0;
    },
  );
  tokens.add(
    11,
    {
      id = 11;
      name = "Cosmos";
      symbol = "ATOM";
      price = 11.0;
    },
  );
  tokens.add(
    12,
    {
      id = 12;
      name = "Sentinel";
      symbol = "DVPN";
      price = 0.08;
    },
  );
  tokens.add(
    13,
    {
      id = 13;
      name = "ZCash";
      symbol = "ZEC";
      price = 28.0;
    },
  );
  tokens.add(
    14,
    {
      id = 14;
      name = "Litecoin";
      symbol = "LTC";
      price = 95.0;
    },
  );
  tokens.add(
    15,
    {
      id = 15;
      name = "Polygon";
      symbol = "MATIC";
      price = 0.95;
    },
  );
  tokens.add(
    16,
    {
      id = 16;
      name = "Optimism";
      symbol = "OP";
      price = 2.8;
    },
  );
  tokens.add(
    17,
    {
      id = 17;
      name = "Fantom";
      symbol = "FTM";
      price = 0.55;
    },
  );
  tokens.add(
    18,
    {
      id = 18;
      name = "Algorand";
      symbol = "ALGO";
      price = 0.22;
    },
  );
  tokens.add(
    19,
    {
      id = 19;
      name = "Ripple";
      symbol = "XRP";
      price = 0.58;
    },
  );
  tokens.add(
    20,
    {
      id = 20;
      name = "Cardano";
      symbol = "ADA";
      price = 0.48;
    },
  );
  tokens.add(
    21,
    {
      id = 21;
      name = "TRON";
      symbol = "TRX";
      price = 0.13;
    },
  );
  tokens.add(
    22,
    {
      id = 22;
      name = "Dogecoin";
      symbol = "DOGE";
      price = 0.16;
    },
  );
  tokens.add(
    23,
    {
      id = 23;
      name = "Shiba Inu";
      symbol = "SHIB";
      price = 0.000025;
    },
  );
  tokens.add(
    24,
    {
      id = 24;
      name = "Uniswap";
      symbol = "UNI";
      price = 9.5;
    },
  );
  tokens.add(
    25,
    {
      id = 25;
      name = "AAVE";
      symbol = "AAVE";
      price = 105.0;
    },
  );
  tokens.add(
    26,
    {
      id = 26;
      name = "Curve";
      symbol = "CRV";
      price = 0.52;
    },
  );
  tokens.add(
    27,
    {
      id = 27;
      name = "MakerDAO";
      symbol = "MKR";
      price = 2800.0;
    },
  );
  tokens.add(
    28,
    {
      id = 28;
      name = "Synthetix";
      symbol = "SNX";
      price = 3.1;
    },
  );
  tokens.add(
    29,
    {
      id = 29;
      name = "Compound";
      symbol = "COMP";
      price = 55.0;
    },
  );
  tokens.add(
    30,
    {
      id = 30;
      name = "Yearn";
      symbol = "YFI";
      price = 8500.0;
    },
  );
  tokens.add(
    31,
    {
      id = 31;
      name = "SushiSwap";
      symbol = "SUSHI";
      price = 1.8;
    },
  );
  tokens.add(
    32,
    {
      id = 32;
      name = "Balancer";
      symbol = "BAL";
      price = 3.5;
    },
  );
  tokens.add(
    33,
    {
      id = 33;
      name = "1INCH";
      symbol = "1INCH";
      price = 0.38;
    },
  );
  tokens.add(
    34,
    {
      id = 34;
      name = "Injective";
      symbol = "INJ";
      price = 28.0;
    },
  );
  tokens.add(
    35,
    {
      id = 35;
      name = "Rune";
      symbol = "RUNE";
      price = 6.5;
    },
  );
  tokens.add(
    36,
    {
      id = 36;
      name = "Osmosis";
      symbol = "OSMO";
      price = 0.85;
    },
  );
  tokens.add(
    37,
    {
      id = 37;
      name = "Secret Network";
      symbol = "SCRT";
      price = 0.42;
    },
  );
  tokens.add(
    38,
    {
      id = 38;
      name = "Juno";
      symbol = "JUNO";
      price = 0.65;
    },
  );
  tokens.add(
    39,
    {
      id = 39;
      name = "Stargaze";
      symbol = "STARS";
      price = 0.018;
    },
  );

  // Service B: Transaction Service
  type Transaction = {
    id : Nat;
    txType : Text;
    tokenSymbol : Text;
    amount : Float;
    fromAddr : Text;
    toAddr : Text;
    network : Text;
    walletAddr : Text;
    timestamp : Int;
  };

  module Transaction {
    public func compareByTimestamp(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Int.compare(transaction2.timestamp, transaction1.timestamp);
    };
  };

  let transactions = List.empty<Transaction>();

  // Service C: Bridge Service
  type BridgeFee = {
    sourceChain : Text;
    destChain : Text;
    fee : Float;
    timeMinutes : Nat;
  };

  let bridgeFees = Map.empty<Text, BridgeFee>();
  bridgeFees.add("ETH->BTC", { sourceChain = "ETH"; destChain = "BTC"; fee = 0.005; timeMinutes = 20 });
  bridgeFees.add("ETH->ICP", { sourceChain = "ETH"; destChain = "ICP"; fee = 0.015; timeMinutes = 120 });
  bridgeFees.add("BTC->ETH", { sourceChain = "BTC"; destChain = "ETH"; fee = 0.002; timeMinutes = 18 });
  bridgeFees.add("ICP->ETH", { sourceChain = "ICP"; destChain = "ETH"; fee = 0.012; timeMinutes = 110 });
  bridgeFees.add("AVAX->ICP", { sourceChain = "AVAX"; destChain = "ICP"; fee = 0.010; timeMinutes = 100 });
  bridgeFees.add("ICP->AVAX", { sourceChain = "ICP"; destChain = "AVAX"; fee = 0.011; timeMinutes = 110 });
  bridgeFees.add("ETH->BTC", { sourceChain = "ETH"; destChain = "BTC"; fee = 0.005; timeMinutes = 20 });

  // Service D: Stats Service
  type Stats = {
    totalSupply : Float;
    circulatingSupply : Float;
    holders : Nat;
    txCount : Nat;
    cyclesConsumed : Nat;
  };

  var totalSupply : Float = 100000000.0;
  var circulatingSupply : Float = 85000000.0;
  var holders : Nat = 1200000;
  var txCount : Nat = 0;
  var cyclesConsumed : Nat = 0;

  // Token Service Functions
  public query ({ caller }) func getTokenPrices() : async [Token] {
    tokens.values().toArray();
  };

  // Transaction Service Functions
  public shared ({ caller }) func recordTransaction(txType : Text, tokenSymbol : Text, amount : Float, fromAddr : Text, toAddr : Text, network : Text, walletAddr : Text) : async Nat {
    let id = txCount + 1;

    if (transactions.size() >= 500) {
      ignore transactions.removeLast();
    };

    let transaction : Transaction = {
      id;
      txType;
      tokenSymbol;
      amount;
      fromAddr;
      toAddr;
      network;
      walletAddr;
      timestamp = 0 : Int;
    };

    transactions.add(transaction);
    txCount += 1;
    id;
  };

  public query ({ caller }) func getTransactions(walletAddr : Text) : async [Transaction] {
    transactions.values().toArray().filter(
      func(tx) {
        tx.walletAddr == walletAddr
      }
    ).sort(Transaction.compareByTimestamp);
  };

  // Bridge Service Functions
  public query ({ caller }) func getBridgeFee(sourceChain : Text, destChain : Text, amount : Float) : async (Float, Nat) {
    let key = sourceChain # "->" # destChain;
    let feeRecord = switch (bridgeFees.get(key)) {
      case (?fee) { fee };
      case (null) { Runtime.trap("invalid bridge type") };
    };

    let feeValue = feeRecord.fee * amount;
    (feeValue, feeRecord.timeMinutes);
  };

  // Stats Service Functions
  public query ({ caller }) func getStats() : async Stats {
    {
      totalSupply;
      circulatingSupply;
      holders;
      txCount;
      cyclesConsumed;
    };
  };

  // HTTP Outcalls
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchExternalUrl(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };
});
