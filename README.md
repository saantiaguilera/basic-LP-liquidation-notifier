## Basic BSC LP Liquidation monitor

This script simply checks an LP initial price vs a simple token pair (pair of 2 tokens in 50/50 weight). If the threshold between the LP prices is surpassed we get notified through telegram immediately to close the position on our own / deleverage / do something fast.

The script can be further enhanced to allow more robust token pairs or other chains (super easy to do but not a necessary requirement for me as of now) or other stuff I simply don't need now.. You are free to fork and make pull requests if you want to enhance it

### Usage

Copy the `testlocal.json` as `local.json` and customize as you wish.
- `threshold` of a token is a percentage (0.1 -> 10%)
- `pairName` is for logging purposes only
- `addrA`/`addrB` are the tokens forming the LP

For usage simply create a crontab (`crontab -e`, set the time interval you would like to be called and make it execute the cron.sh script), that's it.
