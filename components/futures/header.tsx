

export default function SymbolHeader() {
  return (
    <div className="bg-[#1e2329] px-4 py-2 flex flex-wrap items-center justify-between border-b border-[#2b313a] text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 font-bold text-base text-white">
          <span>BTCUSDT</span>
          <span className="text-[10px] bg-[#2b313a] px-1 py-0.5 rounded text-gray-400">Vĩnh cửu</span>
        </div>
        <div className="text-lg font-bold text-[#0ecb81]">77.278,2</div>
        <div className="hidden sm:block">
          <div className="text-gray-400 text-[10px]">Giá danh đánh</div>
          <div className="text-white">77.278,1</div>
        </div>
        <div className="hidden sm:block">
          <div className="text-gray-400 text-[10px]">Funding (8 giờ) / Đếm ngược</div>
          <div className="text-[#0ecb81]">0,00300% / 04:56:29</div>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-gray-400">
        <div>
          <span>24h Cao nhất: </span>
          <span className="text-white">79.859,8</span>
        </div>
        <div>
          <span>24h Thấp nhất: </span>
          <span className="text-white">76.000,3</span>
        </div>
      </div>
    </div>
  );
}