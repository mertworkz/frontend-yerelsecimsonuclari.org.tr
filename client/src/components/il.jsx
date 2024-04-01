import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";
import sendAPIRequest from "../api/sendAPIrequest";

const renkler = {
  "AK Parti": "#FF7200",
  "İyi Parti": "#0F94CA",
  "Yeniden Refah": "#007D60",
  "DEM Parti": "#9A007E",
  MHP: "#B40000",
  CHP: "#EE1D23",
};

const renkDegistir = (plate, parti) => {
  const paths = document.querySelector(`[data-plakakodu="${plate}"] path`);
  if (paths) {
    console.log(plate, "numaralı il bulundu");
    paths.style.fill = renkler[parti];
  }
};

function App() {
  const { ilkodu } = useParams();

  const [IlJson, setIlJson] = useState(null);
  useEffect(() => {
    const fethIl = async () => {
      try {
        const response = await sendAPIRequest("GET", "/api/get/belediyesecim/" + ilkodu, {});
        const { data } = response.data;
        setIlJson(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Beklenmedik bir hata oluştu!",
        });
      }
    };

    fethIl();
  }, [ilkodu]); // `ilkodu` buraya eklenmeli, böylece URL değiştiğinde useEffect tekrar çalışır.

  return (
    <>
      <center>
        <h1>
          Şikayet ve Telif Hakkı için{" "}
          <a href="mailto:iletisim@yerelsecimsonuclari.org.tr">iletisim@yerelsecimsonuclari.org.tr</a>{" "}
          mail adresimizden ulaşabilirsiniz.
        </h1>
      </center>
      <div className="flex flex-wrap mx-2">
  <div className="w-full md:w-1/1 mb-3">
    <div className="bg-white rounded-lg px-5 py-10 ring-5 ring-slate-900/5 shadow-xl">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Parti</th>
              <th scope="col" className="px-6 py-3">Aday</th>
              <th scope="col" className="px-6 py-3">Alınan Oy Oranı</th>
              <th scope="col" className="px-6 py-3">2019 Alınan Oy Oranı</th>
            </tr>
          </thead>
          <tbody>
            {IlJson && IlJson.adaylar.map((aday, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  {aday.partiismi}
                </td>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  {aday.isim}
                </td>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  %{aday.oyorani}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  %{aday.oncekisecim.oyorani}
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
