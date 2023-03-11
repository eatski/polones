import { Prepare } from "@/features/prepare";
import { useRouter } from "next/router";

export default function Yaminabe() {
    const router = useRouter();
    const { id } = router.query;
    if (typeof id === "string") {
        return (
            <Prepare roomId={id}></Prepare>
        )
    }
    return null
}