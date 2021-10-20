const Web3 = require('web3');
const axios = require('axios');

const { Fetcher, ChainId } = require('@pancakeswap/sdk');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { tgAccessToken, tgChatIds, tokens, rpcUrl } = require('./local.json');

const tgUrl = "https://api.telegram.org/bot" + tgAccessToken + "/sendMessage";

const provider = new JsonRpcProvider(rpcUrl);

async function getTokenPrice(addressA, addressB) {
  const tokenA = await Fetcher.fetchTokenData(
    ChainId.MAINNET,
    Web3.utils.toChecksumAddress(addressA),
    provider,
  );
  const tokenB = await Fetcher.fetchTokenData(
    ChainId.MAINNET,
    Web3.utils.toChecksumAddress(addressB),
    provider,
  );
  const pair = await Fetcher.fetchPairData(tokenA, tokenB, provider);
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
    
    const currPrice = await getTokenPrice(tk.addrA, tk.addrB)
    let perc = 0
    if (currPrice < tk.lpPrice) { // price drop
      perc = (tk.lpPrice - currPrice) / tk.lpPrice
    }

    console.log("init: " + tk.lpPrice + " - curr: " + currPrice)
    console.log("percentage: " + (perc * 100))
    if (perc > tk.threshold) {
      sendMessage("[" + tk.pairName + " LP] Pair pegging off from initial value: " + (perc*100).toFixed(2) + "%");
    }
  }
}

main()
