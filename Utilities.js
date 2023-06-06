require('dotenv/config')

// XUMM related
const { XummSdk } = require('xumm-sdk')
const xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)
const getxumm = () => {
    return xumm
}

// Wallet related
const userSchema = require('./schemas/userSchema')
let Wallets = new Map()

const reloadWallets = async () => {
    const users = await userSchema.find()
    if (userSchema.length < 1) return
    for (const user of users) {
        Wallets.set(user._id, user.wallet)
    }
}
const addWallet = async (user, wallet) => {
    Wallets.set(user, wallet)
    await userSchema.findOneAndUpdate({_id: user }, { wallet: wallet }, { upsert: true })
}
const getWallet = (user)=> {
    return Wallets.get(user)
}


module.exports = { getxumm, reloadWallets, addWallet, getWallet }