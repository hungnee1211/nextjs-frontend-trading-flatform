
import ChartContainer from './chart-container';
import SymbolHeader from './header';
import OrderBookContainer from './oder-book-container';
import OrderFormContainer from './oder-form-container';
import PositionContainer from './position-container';


export default function FuturesLayout() {
  return (
    <div className="min-h-screen bg-[#181a20] text-[#text-gray-300] flex flex-col font-sans">
      {/* Header mã giao dịch */}
      <SymbolHeader />

      {/* Main Grid Section */}
      <div className="flex flex-1 flex-col lg:flex-row border-b border-[#2b313a]">
        {/* Cột trái + giữa: Biểu đồ và Vị thế */}
        <div className="flex-1 flex flex-col border-r border-[#2b313a]">
          <div className="flex flex-col xl:flex-row flex-1">
            {/* Biểu đồ */}
            <div className="flex-1 min-h-[450px] border-r border-[#2b313a]">
              <ChartContainer />
            </div>
            {/* Sổ lệnh & Giao dịch gần nhất */}
            <div className="w-full xl:w-[280px] border-r border-[#2b313a]">
              <OrderBookContainer />
            </div>
          </div>
          
          {/* Khu vực bảng vị thế ở dưới biểu đồ */}
          <div className="border-t border-[#2b313a]">
            <PositionContainer />
          </div>
        </div>

        {/* Cột phải: Form đặt lệnh & Tài sản */}
        <div className="w-full lg:w-[300px] bg-[#1e2329]">
          <OrderFormContainer />
        </div>
      </div>
    </div>
  );
}