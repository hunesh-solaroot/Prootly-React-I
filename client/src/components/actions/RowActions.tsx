type Props = {
  onActivity: () => void;
  onAccept: () => void;
  onHold: () => void;
  onUnhold: () => void;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

export default function RowActions(p: Props) {
  const btn = 'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white shadow transition-colors';
  
  return (
    <div className="flex flex-wrap items-center gap-1 justify-center">
      <button className={`${btn} bg-green-600 hover:bg-green-700`} onClick={p.onAccept}>Accept</button>
      <button className={`${btn} bg-amber-500 hover:bg-amber-600`} onClick={p.onHold}>Hold</button>
      <button className={`${btn} bg-violet-500 hover:bg-violet-600`} onClick={p.onUnhold}>Unhold</button>
      <button className={`${btn} bg-blue-500 hover:bg-blue-600`} onClick={p.onStart}>Start</button>
      <button className={`${btn} bg-amber-500 hover:bg-amber-600`} onClick={p.onPause}>Pause</button>
      <button className={`${btn} bg-green-600 hover:bg-green-700`} onClick={p.onComplete}>Complete</button>
      <button className={`${btn} bg-red-500 hover:bg-red-600`} onClick={p.onCancel}>Cancel</button>
      <button className={`${btn} bg-red-600 hover:bg-red-700`} onClick={p.onDelete}>Delete</button>
      <button className={`${btn} bg-sky-500 hover:bg-sky-600`} onClick={p.onActivity}>Activity</button>
    </div>
  );
}
