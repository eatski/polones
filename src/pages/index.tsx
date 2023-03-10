import { playerCollection, roomCollection } from "@/models/store";
import { doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <main>
      <h1>Hello World</h1>
      {loading ? (
        <div>loading</div>
      ) : (
        <button
          onClick={async () => {
            const room = doc(roomCollection);
            const player = doc(playerCollection(room.id), "testes");
            setLoading(true);
            await Promise.all([setDoc(player, {}), setDoc(room, { phase: "prepare" })]);
            router.push(`/rooms/${room.id}`);
          }}
        >
          start
        </button>
      )}
    </main>
  );
}
