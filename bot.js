const Web3 = require('web3');
const axios = require('axios');

const { Fetcher, ChainId, Token } = require('@pancakeswap/sdk');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { tgAccessToken, tgChatIds, tokens, addr, mainnetUrl } = require('./local.json');

const tgUrl = "https://api.telegram.org/bot" + tgAccessToken + "/sendMessage";

const provider = new JsonRpcProvider(mainnetUrl);

const web3Client = new Web3(mainnetUrl)
const eth = web3Client.eth

async function getTokenPrice(address) {
  const BNB = new Token(ChainId.MAINNET, addr, 18);
  const token = await Fetcher.fetchTokenData(
    ChainId.MAINNET,
    address,
    provider,
  );
  const pair = await Fetcher.fetchPairData(BNB, token, provider);
  const price = pair.token0Price.toSignificant(10);
  return price;
}

async function sendMessage(msg) {
  tgChatIds.forEach(async tgChatId => {
    await axios.post(tgUrl, {
      chat_id: tgChatId,
      text: msg,
      disable_notification: false,
    });
  });
}

async function main() {
  for (i = 0; i < tokens.length; i++) {
    const tk = tokens[i]
    
    const currPrice = await getTokenPrice(tk.addr)
    const perc = Math.abs(currPrice - tk.lpPrice) / tk.lpPrice

    console.log("init: " + tk.lpPrice + " - curr: " + currPrice)
    console.log("percentage: " + (perc * 100))
    if (perc > tk.threshold) {
      sendMessage("[" + tk.pairName + " LP] Pair pegging off from initial value: " + (perc*100).toFixed(2) + "%");
    }
  }
}

main()
