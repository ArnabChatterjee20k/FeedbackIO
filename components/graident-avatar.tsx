// @ts-ignore
import gradient from "random-gradient";
export default function GraidentAvatar({ id }: { id: string }) {
  return <div className="aspect-square size-8 rounded-lg" style={{ background: gradient(id) }} />;
}
