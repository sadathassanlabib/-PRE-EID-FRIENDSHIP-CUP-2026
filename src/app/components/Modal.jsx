export default function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="w-full max-w-lg bg-black border border-white/10 rounded-2xl p-6 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div>{children}</div>

      </div>

    </div>
  )
}