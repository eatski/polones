import { Prepare } from "./prepare";
import React, { useMemo } from "react";
import { useSubscribeDocument } from "@/util/firestore-hooks";
import { doc, writeBatch } from "@firebase/firestore";
import { potsCollection, roomCollection, RoomDocument } from "@/models/store";
import { store } from "@/lib/firestore";
import { Game } from "./game";

export type RoomProps = {
  roomId: string;
};
export const Room: React.FC<RoomProps> = ({ roomId }) => {
  const roomDocumentRef = useMemo(() => doc(roomCollection, roomId), [roomId]);
  const roomDocumentData = useSubscribeDocument(roomDocumentRef);

  switch (roomDocumentData.status) {
    case "error":
      return <div>error</div>;
    case "loading":
      return <div>loading</div>;
    case "not-found":
      return <div>not found</div>;
    case "success":
      return <Success roomDocumentData={roomDocumentData.data} roomId={roomId}></Success>;
  }
};

const Success: React.FC<{ roomDocumentData: RoomDocument; roomId: string }> = ({ roomDocumentData, roomId }) => {
  switch (roomDocumentData.phase) {
    case "prepare":
      return (
        <Prepare
          roomId={roomId}
          onReady={() => {
            const batch = writeBatch(store);
            [1, 2, 3].forEach(() => {
              const potsCollectionRef = potsCollection(roomId);
              batch.set(doc(potsCollectionRef), {
                status: "ok",
              });
            });
            batch.set(doc(roomCollection, roomId), {
              phase: "game",
            });
            batch.commit();
          }}
        ></Prepare>
      );
    case "game":
      return <Game roomId={roomId} />;
  }
};
