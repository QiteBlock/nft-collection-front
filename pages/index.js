import Image from "next/image"
import { useRouter } from "next/router"

export default function Home() {
    const router = useRouter()
    return (
        <main className="w-screen flex justify-center items-center">
            <div className="my-32 mx-32 flex justify-around w-full">
                <div className="mx-12 my-12">
                    <h1 className="text-white text-3xl font-bold">My Beauty NFT</h1>
                    <h3 className="text-white text-xl font-bold pt-8">
                        The female figure depicted in the NFT is elegant and graceful, with a slender yet curvy
                        physique. She has a symmetrical face, with high cheekbones, full lips, and clear, bright eyes.
                        Her hair is lustrous and flowing, framing her face and cascading down her back.
                    </h3>
                    <h3 className="text-white text-xl font-bold py-2">
                        Her skin is smooth and flawless, with a healthy glow that suggests vitality and radiance. She
                        wears an expression of serene confidence, with a slight smile that hints at an inner peace and
                        contentment.{" "}
                    </h3>
                    <h3 className="text-white text-xl font-bold py-2">
                        Her attire is tasteful and sophisticated, with intricate details that suggest a refined and
                        discerning taste. The colors and textures of her clothing complement her natural beauty,
                        enhancing her allure and sophistication.{" "}
                    </h3>
                    <h3 className="text-white text-xl font-bold pb-8">
                        Overall, the beauty NFT female exudes a sense of timeless elegance and refinement, captivating
                        viewers with her poise and allure.
                    </h3>
                    <div>
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded px-8 py-2 ml-auto"
                            onClick={async function () {
                                router.push("/presale")
                            }}
                        >
                            <h1 className="text-white text-xl font-bold">Allowlist Sales</h1>
                        </button>
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded px-8 py-2 ml-8"
                            onClick={async function () {
                                router.push("/mint")
                            }}
                        >
                            <h1 className="text-white text-xl font-bold">Public Sales</h1>
                        </button>
                    </div>
                </div>
                <Image src="/assets/images/mybeauty.png" width={500} height={500} />
            </div>
        </main>
    )
}
