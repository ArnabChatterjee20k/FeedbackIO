// @ts-ignore
import gradient from "random-gradient";
export default function GraidentAvatar({ id , fullRound}: { id: string,fullRound?:boolean }) {
  return <div className={`aspect-square size-8 ${fullRound?"rounded-lg":"rounded-full"}`} style={{ background: gradient(id) }} />;
}
