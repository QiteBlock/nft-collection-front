import Image from "next/image"
import { useMoralis } from "react-moralis"
import { beautyAbi, beautyAddress } from "../constants/beauty-constant"
import { useWeb3Contract } from "react-moralis"
import { useNotification } from "@web3uikit/core"
import { useEffect, useState } from "react"
import Countdown from "react-countdown"

export default function Mint() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const beautyContractAddress = chainId in beautyAddress ? beautyAddress[chainId][0] : null
    const dispatch = useNotification()
    const [totalSupply, setTotalSupply] = useState("0")
    const [mintPrice, setMintPrice] = useState(null)
    const [maxBeauty, setMaxBeauty] = useState("100")
    const [publicSalesStartTime, setPublicSalesStartTime] = useState(null)
    const [isLoadingPublicProcess, setIsLoadingPublicProcess] = useState(false)
    const [isSoldOut, setIsSoldOut] = useState(false)

    const { runContractFunction: getTotalSupply } = useWeb3Contract({
        abi: beautyAbi,
        contractAddress: beautyContractAddress,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: getMaxSalesBeauty } = useWeb3Contract({
        abi: beautyAbi,
        contractAddress: beautyContractAddress,
        functionName: "max_sales_beauty",
        params: {},
    })

    const { runContractFunction: getPublicStartTime } = useWeb3Contract({
        abi: beautyAbi,
        contractAddress: beautyContractAddress,
        functionName: "publicSalesStartTime",
        params: {},
    })

    const { runContractFunction: getMintPrice } = useWeb3Contract({
        abi: beautyAbi,
        contractAddress: beautyContractAddress,
        functionName: "price",
        params: {},
    })

    const { runContractFunction: mint } = useWeb3Contract({
        abi: beautyAbi,
        contractAddress: beautyContractAddress,
        functionName: "mint",
        params: { beautyNumber: "1" },
        msgValue: mintPrice,
    })

    async function updateInfo() {
        const totalSupplyFromContract = (
            await getTotalSupply({
                onError: (error) => console.log(error),
            })
        ).toString()
        const maxBeautyFromContract = (
            await getMaxSalesBeauty({
                onError: (error) => console.log(error),
            })
        ).toString()
        const publicStartTimeFromContract = (
            await getPublicStartTime({
                onError: (error) => console.log(error),
            })
        ).toString()
        const mintPriceFromContract = (
            await getMintPrice({
                onError: (error) => console.log(error),
            })
        ).toString()
        setTotalSupply(totalSupplyFromContract)
        setMaxBeauty(maxBeautyFromContract)
        setPublicSalesStartTime(publicStartTimeFromContract)
        setMintPrice(mintPriceFromContract)
        setIsSoldOut(maxBeautyFromContract - totalSupplyFromContract > 0)
    }

    const handleSuccess = async (tx, message, title) => {
        await tx.wait(1)
        handleNotification(message, title, "info")
        updateInfo()
        setIsLoadingPublicProcess(false)
    }

    const handleFailed = async (message, title) => {
        handleNotification(message, title, "error")
        updateInfo()
        setIsLoadingPublicProcess(false)
    }

    const handleNotification = function (message, title, type) {
        dispatch({
            type: type,
            message: message.length > 100 ? message.substring(0, 100) + "..." : message,
            title: title,
            icon: "bell",
            position: "topR",
        })
    }

    const counterRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <div>
                    {isSoldOut ? (
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded px-8 py-2 ml-auto"
                            disabled={isLoadingPublicProcess}
                            onClick={async function () {
                                setIsLoadingPublicProcess(true)
                                await mint({
                                    onSuccess: async (tx) =>
                                        await handleSuccess(tx, "Minted Successfully!", "Information"),
                                    onError: async (err) => {
                                        await handleFailed(err.message ? err.message : err, "Error")
                                    },
                                })
                            }}
                        >
                            {isLoadingPublicProcess ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                <h1 className="text-white text-xl font-bold">Mint</h1>
                            )}
                        </button>
                    ) : (
                        <h1 className="text-white text-3xl font-bold mt-8 text-center">Sold out!</h1>
                    )}
                </div>
            )
        } else {
            return (
                <>
                    <h1 className="text-white text-3xl font-bold mt-8 text-center">Sales start in :</h1>
                    <h1 className="text-white text-2xl font-bold mt-8 text-center">
                        {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds
                    </h1>
                </>
            )
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateInfo()
        }
    }, [isWeb3Enabled])

    return (
        <div className="flex flex-col justify-center items-center">
            {isWeb3Enabled && publicSalesStartTime && mintPrice ? (
                <>
                    <h1 className="text-white text-3xl font-bold my-8">Public Sale Page</h1>
                    <Image src="/assets/images/mybeauty.png" width={500} height={500} />
                    <h1 className="text-white text-3xl font-bold mt-8">
                        Total Supply : {totalSupply} / {maxBeauty}
                    </h1>
                    <div className="my-8">
                        <Countdown
                            date={new Date(0).setUTCSeconds(publicSalesStartTime)}
                            renderer={counterRenderer}
                            zeroPadDays={2}
                            zeroPadTime={2}
                        />
                    </div>
                </>
            ) : (
                <div>
                    <h1 className="text-white text-3xl font-bold mt-32">Please Connect Wallet</h1>
                </div>
            )}
        </div>
    )
}
