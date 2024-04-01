import { useEffect, useState } from "react";
import TurkeyMap from "turkey-map-react";
import { Tooltip } from "antd";

import Swal from "sweetalert2";
import sendAPIRequest from "../api/sendAPIrequest";
const renkler = {
  "AK Parti": "#FF7200",
  "İyi Parti": "#0F94CA",
  "Yeniden Refah": "#007D60",
  "DEM Parti": "#9A007E",
  "MHP": "#B40000",
  "CHP": "#EE1D23",
};

const renkDegistir = (plate, parti) => {
  const paths = document.querySelector(`[data-plakakodu="${plate}"] path`);
  if (paths) {
    console.log(plate, "numaralı il bulundu");
    paths.style.fill = renkler[parti];
  }
};

function App() {
  const [genelJson, setGenelJson] = useState(null);
  const [istanbulJson, setİstanbulJson] = useState(null)
  const [GenelBilgi, setGenelBilgi] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendAPIRequest(
          "GET",
          "/api/get/belediyesecim",
          {}
        );
        const { data } = response;

        setGenelJson(data.data);

        Object.entries(data.data).forEach(([plaka, ilBilgisi]) => {
          const kazananParti = ilBilgisi.adaylar[0].partiismi;
          renkDegistir(plaka, kazananParti);
        });
      } catch (error) {
        // Hata yönetimi
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Beklenmedik bir hata oluştu!",
        });
      }
    };
    const fetchGenelBilgi = async () => {
        try {
            const response = await sendAPIRequest(
              "GET",
              "/api/get/genelbilgi",
              {}
            );
            const { data } = response.data;
            setGenelBilgi(data);
          } catch (error) {
            // Hata yönetimi
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message || "Beklenmedik bir hata oluştu!",
            });
          }
    }
    const fethIstanbul = async () => {
        try {
            const response = await sendAPIRequest(
              "GET",
              "/api/get/belediyesecim/34",
              {}
            );
            const { data } = response.data;
            setİstanbulJson(data);
          } catch (error) {
            // Hata yönetimi
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message || "Beklenmedik bir hata oluştu!",
            });
          }
    }

    fetchData();
    fethIstanbul();
    fetchGenelBilgi()
  }, []);



  return (
    <>
    <center>
        <h1>
        Şikayet ve Telif Hakkı için <a href="mailto:iletisim@yerelsecimsonuclari.org.tr">iletisim@yerelsecimsonuclari.org.tr</a> mail adresimizden ulaşabilirsiniz.
        </h1>
    </center>
      <div className="flex flex-wrap mx-2 ">
      <div className="w-full md:w-1/1 mb-3 space-x-4">
  <div className="bg-stone-100 rounded-lg px-5 py-10 ring-5 ring-slate-900/5 shadow-xl relative">
    <h3 className="text-slate-900 font-medium">Türkiye Haritası</h3>
    <TurkeyMap
      customStyle={{}}
      onClick={({ plateNumber, name }) => {
        window.location.href = `/il/${plateNumber}`; // Kullanıcıyı yeni URL'ye yönlendir
      }}
      cityWrapper={(cityComponent, cityData) => (
        <Tooltip
          title={`${cityData.name} - ${
            genelJson && genelJson[cityData.plateNumber]
              ? "Kazanan: "+"["+genelJson[cityData.plateNumber].adaylar[0].partiismi+"] "+genelJson[cityData.plateNumber].adaylar[0].isim+" Açılan Sandık Yüzdesi: %" + genelJson[cityData.plateNumber].acilansandikyuzde
              : ""
          }`}
          key={cityData.id}
        >
          {cityComponent}
        </Tooltip>
      )}
    />
    <div className="flex justify-center mt-10">
      <ul className="flex space-x-4 list-none">
        {Object.entries(renkler).map(([parti, renk]) => (
          <li key={parti} style={{ color: renk }}>
            {parti}
          </li>
        ))}
      </ul>
    </div>
    <div className="absolute top-0 right-0 p-5">
      {/* Buraya sağ üste gelecek metni ekleyin */}
      <p>
        {
            GenelBilgi && (
                <p className="icon-text">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
    <path  d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
  </svg>
  Açılan sandık Oranı: %{GenelBilgi.acilansandikyuzde}
</p>
            )
        }
      </p>
    </div>
  </div>
</div>

<div className="w-full md:w-1/1 mb-3">
  <div className="bg-gray-800 rounded-lg px-5 py-10 ring-5 ring-gray-300 shadow-xl">
  <center>
  <h1 className="text-white font-large">İstanbul Seçim Oranı</h1>
  </center>
    {
      istanbulJson && (
        <div className="flex justify-between"> {/* İki öğe arasında maksimum mesafe */}
          {istanbulJson.adaylar.slice(0, 2).map((aday, index) => (
            <div key={index} className="flex flex-col items-center"> {/* Dikey yönlendirme ve merkezleme */}
              <p className="text-center text-white">{aday.isim}</p> {/* Metin rengini koyu yap */}
              <img
                src={aday.fotograf ? `https://secim2024.teimg.com/secim2024/assets/img/candidate/${aday.fotograf}` : "anon_aday.png"}
                alt={aday.isim}
                style={{ height: '150px', width: '150px' }}
                className="object-cover rounded-full" // Resmi yuvarlak yap
              />
              <p className="text-center text-white">{aday.oyorani}%</p> {/* Metin rengini koyu yap */}
              {/* Diğer aday bilgileri burada kullanılabilir */}
            </div>
          ))}
        </div>
      )
    }
  </div>
</div>

<div className="w-full md:w-1/1 mb-3">
    <div className="bg-white rounded-lg px-5 py-10 ring-5 ring-slate-900/5 shadow-xl">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Parti İsmi</th>
              <th scope="col" className="px-6 py-3">Toplam Oy Oranı</th>
              <th scope="col" className="px-6 py-3">Toplam Oy Sayısı</th>
              <th scope="col" className="px-6 py-3">Kazanılan Büyükşehir Sayısı</th>
              <th scope="col" className="px-6 py-3">Kazanılan İl Sayısı</th>
              <th scope="col" className="px-6 py-3">Kazanılan İlçe Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {GenelBilgi && GenelBilgi.partiler.map((aday, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  {aday.name}
                </td>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                %{aday.oyorani}
                </td>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  {aday.oysayisi.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {aday.kazanilanbuyukilsayisi.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {aday.kazanilanilsayisi.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {aday.kazanilanilcesayisi.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

        
      </div>
    </>
  );
}

export default App;
