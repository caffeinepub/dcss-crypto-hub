import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
persistent actor {
  // ── Admin ──
  stable var adminPrincipal : Text = "2vxsx-fae";

  func isAdmin(caller : Principal) : Bool {
    caller.toText() == adminPrincipal;
  };

  public shared ({ caller }) func setAdmin(newAdmin : Text) : async () {
    if (not isAdmin(caller)) Runtime.trap("not admin");
    adminPrincipal := newAdmin;
  };

  // ── Token Oracle ──
  type TokenInfo = {
    id : Nat;
    name : Text;
    symbol : Text;
    price : Float;
    lastUpdate : Int;
  };

  module TokenInfo {
    public func compareById(t1 : TokenInfo, t2 : TokenInfo) : Order.Order {
      Nat.compare(t1.id, t2.id);
    };
    public func compareBySymbol(t1 : TokenInfo, t2 : TokenInfo) : Order.Order {
      Text.compare(t1.symbol, t2.symbol);
    };
  };

  let tokens = Map.empty<Nat, TokenInfo>();
  tokens.add(0,  { id = 0;  name = "DCSS";                 symbol = "DCSS";  price = 0.85;       lastUpdate = Time.now() });
  tokens.add(1,  { id = 1;  name = "Internet Computer";    symbol = "ICP";   price = 12.50;      lastUpdate = Time.now() });
  tokens.add(2,  { id = 2;  name = "Ethereum";             symbol = "ETH";   price = 3200.0;     lastUpdate = Time.now() });
  tokens.add(3,  { id = 3;  name = "Bitcoin";              symbol = "BTC";   price = 67000.0;    lastUpdate = Time.now() });
  tokens.add(4,  { id = 4;  name = "Solana";               symbol = "SOL";   price = 180.0;      lastUpdate = Time.now() });
  tokens.add(5,  { id = 5;  name = "Avalanche";            symbol = "AVAX";  price = 38.0;       lastUpdate = Time.now() });
  tokens.add(6,  { id = 6;  name = "Near";                 symbol = "NEAR";  price = 7.0;        lastUpdate = Time.now() });
  tokens.add(7,  { id = 7;  name = "Polkadot";             symbol = "DOT";   price = 9.0;        lastUpdate = Time.now() });
  tokens.add(8,  { id = 8;  name = "Cosmos";               symbol = "ATOM";  price = 11.0;       lastUpdate = Time.now() });
  tokens.add(9,  { id = 9;  name = "ChainLink";            symbol = "LINK";  price = 18.0;       lastUpdate = Time.now() });
  tokens.add(10, { id = 10; name = "Injective";            symbol = "INJ";   price = 28.0;       lastUpdate = Time.now() });
  tokens.add(11, { id = 11; name = "Celestia";             symbol = "TIA";   price = 8.5;        lastUpdate = Time.now() });
  tokens.add(12, { id = 12; name = "Render";               symbol = "RENDER"; price = 7.2;       lastUpdate = Time.now() });
  tokens.add(13, { id = 13; name = "Bittensor";            symbol = "TAO";   price = 450.0;      lastUpdate = Time.now() });
  tokens.add(14, { id = 14; name = "Fetch.ai";             symbol = "FET";   price = 2.1;        lastUpdate = Time.now() });
  tokens.add(15, { id = 15; name = "Akash";                symbol = "AKT";   price = 3.8;        lastUpdate = Time.now() });
  tokens.add(16, { id = 16; name = "Arweave";              symbol = "AR";    price = 28.0;       lastUpdate = Time.now() });
  tokens.add(17, { id = 17; name = "Mina";                 symbol = "MINA";  price = 0.78;       lastUpdate = Time.now() });
  tokens.add(18, { id = 18; name = "Cardano";              symbol = "ADA";   price = 0.48;       lastUpdate = Time.now() });
  tokens.add(19, { id = 19; name = "Pyth";                 symbol = "PYTH";  price = 0.42;       lastUpdate = Time.now() });
  tokens.add(20, { id = 20; name = "Grass";                symbol = "GRASS"; price = 1.8;        lastUpdate = Time.now() });
  tokens.add(21, { id = 21; name = "Sentinel";             symbol = "DVPN";  price = 0.08;       lastUpdate = Time.now() });
  tokens.add(22, { id = 22; name = "Rune";                 symbol = "RUNE";  price = 6.5;        lastUpdate = Time.now() });
  tokens.add(23, { id = 23; name = "Osmosis";              symbol = "OSMO";  price = 0.85;       lastUpdate = Time.now() });
  tokens.add(24, { id = 24; name = "The Graph";            symbol = "GRT";   price = 0.28;       lastUpdate = Time.now() });
  tokens.add(25, { id = 25; name = "Livepeer";             symbol = "LPT";   price = 12.0;       lastUpdate = Time.now() });
  tokens.add(26, { id = 26; name = "Numerai";              symbol = "NMR";   price = 18.0;       lastUpdate = Time.now() });
  tokens.add(27, { id = 27; name = "API3";                 symbol = "API3";  price = 2.1;        lastUpdate = Time.now() });
  tokens.add(28, { id = 28; name = "Virtual Protocol";    symbol = "VIRTUAL"; price = 1.2;      lastUpdate = Time.now() });
  tokens.add(29, { id = 29; name = "Kaito";                symbol = "KAITO"; price = 1.8;        lastUpdate = Time.now() });
  tokens.add(30, { id = 30; name = "IO.net";               symbol = "IO";    price = 3.5;        lastUpdate = Time.now() });
  tokens.add(31, { id = 31; name = "Athena";               symbol = "ATH";   price = 0.12;       lastUpdate = Time.now() });
  tokens.add(32, { id = 32; name = "Trac";                 symbol = "TRAC";  price = 0.45;       lastUpdate = Time.now() });
  tokens.add(33, { id = 33; name = "IP";                   symbol = "IP";    price = 6.2;        lastUpdate = Time.now() });
  tokens.add(34, { id = 34; name = "USDT";                 symbol = "USDT";  price = 1.0;        lastUpdate = Time.now() });
  tokens.add(35, { id = 35; name = "USDC";                 symbol = "USDC";  price = 1.0;        lastUpdate = Time.now() });
  tokens.add(36, { id = 36; name = "CLP Token";            symbol = "CLP";   price = 0.0011;     lastUpdate = Time.now() });
  tokens.add(37, { id = 37; name = "0G Labs";              symbol = "0G";    price = 0.08;       lastUpdate = Time.now() });
  tokens.add(38, { id = 38; name = "Shell";                symbol = "SHELL"; price = 0.35;       lastUpdate = Time.now() });
  tokens.add(39, { id = 39; name = "dVPN Sentinel";       symbol = "UP";    price = 0.006;      lastUpdate = Time.now() });

  public query func getTokenPrices() : async [TokenInfo] {
    tokens.values().toArray().sort(TokenInfo.compareById);
  };

  // ── Transaction Service ──
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
    public func compareByTimestamp(t1 : Transaction, t2 : Transaction) : Order.Order {
      Int.compare(t2.timestamp, t1.timestamp);
    };
  };

  let transactions = List.empty<Transaction>();

  public shared func recordTransaction(txType : Text, tokenSymbol : Text, amount : Float, fromAddr : Text, toAddr : Text, network : Text, walletAddr : Text) : async Nat {
    let id = transactions.size() + 1;
    if (transactions.size() >= 500) { ignore transactions.removeLast() };
    transactions.add({ id; txType; tokenSymbol; amount; fromAddr; toAddr; network; walletAddr; timestamp = Time.now() });
    id;
  };

  public query func getTransactions(walletAddr : Text) : async [Transaction] {
    transactions.values().toArray().filter(func(tx) { tx.walletAddr == walletAddr }).sort(Transaction.compareByTimestamp);
  };

  // ── Bridge Service ──
  type BridgeFee = { sourceChain : Text; destChain : Text; fee : Float; timeMinutes : Nat };

  let bridgeFees = Map.empty<Text, BridgeFee>();
  bridgeFees.add("ETH->ICP",  { sourceChain = "ETH";  destChain = "ICP";  fee = 0.015; timeMinutes = 120 });
  bridgeFees.add("BTC->ETH",  { sourceChain = "BTC";  destChain = "ETH";  fee = 0.002; timeMinutes = 18  });
  bridgeFees.add("ICP->ETH",  { sourceChain = "ICP";  destChain = "ETH";  fee = 0.012; timeMinutes = 110 });
  bridgeFees.add("AVAX->ICP", { sourceChain = "AVAX"; destChain = "ICP";  fee = 0.010; timeMinutes = 100 });
  bridgeFees.add("ICP->AVAX", { sourceChain = "ICP";  destChain = "AVAX"; fee = 0.011; timeMinutes = 110 });
  bridgeFees.add("SOL->ETH",  { sourceChain = "SOL";  destChain = "ETH";  fee = 0.008; timeMinutes = 30  });
  bridgeFees.add("ETH->SOL",  { sourceChain = "ETH";  destChain = "SOL";  fee = 0.009; timeMinutes = 35  });

  public query func getBridgeFee(sourceChain : Text, destChain : Text, amount : Float) : async (Float, Nat) {
    let key = sourceChain # "->" # destChain;
    let feeRecord = switch (bridgeFees.get(key)) {
      case (?fee) { fee };
      case (null) { Runtime.trap("invalid bridge type") };
    };
    (feeRecord.fee * amount, feeRecord.timeMinutes);
  };

  // ── Stats / Ecosystem ──
  type Stats = {
    totalSupply : Float;
    circulatingSupply : Float;
    holders : Nat;
    txCount : Nat;
    cyclesConsumed : Nat;
  };

  type EcosystemStats = {
    totalTokens : Nat;
    totalNetworks : Nat;
    totalTransactions : Nat;
    totalHolders : Nat;
    totalSponsors : Nat;
    rewardsDistributed : Float;
  };

  var totalSupply : Float = 100_000_000.0;
  var circulatingSupply : Float = 85_000_000.0;
  var holders : Nat = 1_200_000;
  var rewardsDistributed : Float = 0.0;

  public query func getStats() : async Stats {
    { 
      totalSupply; 
      circulatingSupply; 
      holders; 
      txCount = transactions.size(); 
      cyclesConsumed = 0;
    };
  };

  public query func getEcosystemStats() : async EcosystemStats {
    {
      totalTokens = tokens.size();
      totalNetworks = 18;
      totalTransactions = transactions.size();
      totalHolders = holders;
      totalSponsors = sponsors.size();
      rewardsDistributed;
    };
  };

  // ── Admin Logs ──
  type AdminLog = { action : Text; caller : Text; timestamp : Int };
  let adminLogs = List.empty<AdminLog>();

  func logAdmin(caller : Principal, action : Text) {
    adminLogs.add({ action; caller = caller.toText(); timestamp = Time.now() });
  };

  public query ({ caller }) func getAdminLogs() : async [AdminLog] {
    if (not isAdmin(caller)) Runtime.trap("not admin");
    adminLogs.values().toArray();
  };

  // ── Rewards Distribution ──
  public shared ({ caller }) func distributeRewards(amount : Float) : async () {
    if (not isAdmin(caller)) Runtime.trap("not admin");
    rewardsDistributed += amount;
    logAdmin(caller, "distributeRewards: " # amount.toText());
  };

  // ── Sponsor Records ──
  type SponsorRecord = {
    id : Nat;
    sponsor : Text;
    amount : Float;
    message : Text;
    timestamp : Int;
  };

  let sponsors = List.empty<SponsorRecord>();

  public shared func recordSponsor(sponsor : Text, amount : Float, message : Text) : async Nat {
    let id = sponsors.size() + 1;
    sponsors.add({ id; sponsor; amount; message; timestamp = Time.now() });
    id;
  };

  public query func getSponsorLogs() : async [SponsorRecord] {
    sponsors.values().toArray();
  };

  // ── Vault (DCSS Stablecoin) ──
  type Vault = { collateral : Nat; mintedDCSS : Nat; lastUpdated : Int };
  let vaults = Map.empty<Principal, Vault>();

  public shared ({ caller }) func openVault(collateral : Nat) : async Nat {
    let id = vaults.size() + 1;
    vaults.add(caller, { collateral; mintedDCSS = 0; lastUpdated = Time.now() });
    id;
  };

  public shared ({ caller }) func closeVault(_ : Nat) : async () {
    vaults.remove(caller);
  };

  // ── HTTP Outcalls ──
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func fetchExternalUrl(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };
};
