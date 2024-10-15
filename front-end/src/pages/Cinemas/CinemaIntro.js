import React from "react";
import { useParams } from "react-router-dom";
import './CinemaDetail.scss';  // Đảm bảo bạn đã import file CSS

const cinemasData = [
    {
        id: "fmovie-hà-nội",
        name: "Fmovie chi nhánh Hà Nội",
        address: "124 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        hotline: "0867 460 053",
        description: "Fmovie chi nhánh Hà Nội có vị trí trung tâm, dễ dàng tiếp cận từ nhiều quận huyện của thành phố. Với kiến trúc hiện đại và công nghệ âm thanh, hình ảnh tiên tiến, rạp mang đến trải nghiệm điện ảnh tuyệt vời cho khán giả. Đặc biệt, rạp thường xuyên tổ chức các buổi chiếu sớm và sự kiện gặp gỡ các nghệ sĩ nổi tiếng, tạo nên không gian giải trí sôi động cho cộng đồng yêu điện ảnh Hà Nội.",
        imageUrl1: "https://nativespeaker.vn/uploaded/page_1601_1712215670_1713753865.jpg",
        imageUrl2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAFJZdr-RTJ5_Sa_unf88P4OIW0dXyYcDcFQ&s",
        imageUrl3: "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2022/092022/980x500.jpg",
      },
      {
        id: "fmovie-hồ-chí-minh",
        name: "Fmovie chi nhánh Hồ Chí Minh",
        address: "Hồ Chí Minh, Vietnam",
        hotline: "0868 123 456",
        description: "Fmovie chi nhánh Hồ Chí Minh là rạp chiếu phim nổi bật tại trung tâm thành phố năng động nhất Việt Nam. Với không gian rộng rãi, thiết kế sang trọng và hiện đại, rạp mang đến cho khán giả trải nghiệm xem phim đẳng cấp quốc tế. Rạp được trang bị hệ thống âm thanh Dolby Atmos và màn hình 4K, đảm bảo chất lượng hình ảnh và âm thanh tuyệt hảo. Ngoài ra, rạp còn có khu vực ẩm thực đa dạng, phòng chờ VIP, và dịch vụ đặt vé trực tuyến tiện lợi, đáp ứng mọi nhu cầu giải trí của người xem phim tại Sài Gòn.",
        imageUrl1: "https://imgcdn.stablediffusionweb.com/2024/4/5/a708a819-100a-4c90-81d9-f47c1b216749.jpg",
        imageUrl2: "https://imgcdn.stablediffusionweb.com/2024/5/18/5fa7a09b-23ef-4666-9da2-7f5520520c30.jpg",
        imageUrl3: "https://npr.brightspotcdn.com/dims4/default/4fe4b48/2147483647/strip/true/crop/980x551+0+0/resize/880x495!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fuploads%2F2021%2F6%2F28%2FEmpty%20theater%20shutterstock_Fer%20Gregory.jpg",
      },
      {
        id: "fmovie-đà-nẵng",
        name: "Fmovie chi nhánh Đà Nẵng",
        address: "Đà Nẵng, Vietnam",
        hotline: "0868 123 456",
        description: "Fmovie chi nhánh Đà Nẵng là rạp chiếu phim nổi bật tại thành phố biển xinh đẹp của miền Trung. Tọa lạc tại vị trí đắc địa, rạp không chỉ là điểm đến giải trí lý tưởng mà còn là biểu tượng văn hóa mới của Đà Nẵng. Với kiến trúc độc đáo kết hợp giữa hiện đại và truyền thống, rạp thu hút cả khách du lịch lẫn người dân địa phương. Rạp được trang bị công nghệ chiếu phim 3D tiên tiến, ghế ngồi thoải mái, và có các phòng chiếu riêng cho các sự kiện đặc biệt. Đặc biệt, rạp thường xuyên tổ chức các liên hoan phim địa phương, góp phần quảng bá văn hóa và du lịch Đà Nẵng.",
        imageUrl1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVsv_y8G619ZrgLVtBUF6PRzwGSXv1vWTWzA&s",
        imageUrl2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUf9BkJ40Ap0Zp7UKE9PBW_F9tcnVkdWH81A&s",
        imageUrl3: "https://variety.com/wp-content/uploads/2013/07/placeholder_movietheater.jpg?w=1000&h=667&crop=1",
      },
];

const CinemaDetail = () => {
  const { cinemaId } = useParams();

  // Tìm thông tin chi tiết của rạp
  const cinema = cinemasData.find((cinema) => cinema.id === cinemaId);

  if (!cinema) {
    return <div>Rạp không tồn tại.</div>;
  }

  return (
    <div className="container mp">
      <section id="cinema-info" className="cinema-info">
        <div className="relative">
          <div className="flex justify-center">
            <p className="line">{cinema.name}</p>
          </div>
        </div>
  
        <div className="row layout">
          <div className="text1 col-6">
            <p style={{ lineHeight: "1.8" }}>
              {cinema.description}
              <br />
              Rạp chiếu phim này nằm tại trung tâm thành phố với không gian rộng rãi, thoáng mát và nhiều tiện nghi hiện đại.
              <br />
              Địa chỉ: <b style={{ color: "#F36F21" }}>{cinema.address}</b>
            </p>
          </div>
          <div className="img col-6">
            <img className="layout-img1" src={cinema.imageUrl1} alt={cinema.name} />
          </div>
        </div>
  
        <div className="row layout">
          <div className="img col-6">
            <img className="layout-img1" src={cinema.imageUrl2} alt={cinema.name} />
          </div>
          <div className="text1 col-6">
            <p style={{ fontWeight: "bold", color: "#F36F21" }}>
              Đến với {cinema.name}, bạn sẽ được trải nghiệm những bộ phim hay nhất với chất lượng hình ảnh và âm thanh hàng đầu.
            </p>
            <p>
              Rạp còn cung cấp dịch vụ tiện lợi như wifi miễn phí, phòng chờ thoải mái, và nhiều khuyến mãi hấp dẫn.
              Hotline: <b style={{ color: "#F36F21" }}>{cinema.hotline}</b>
            </p>
          </div>
        </div>
  
        <div>
          {/* <img className="row layout" src={cinema.imageUrl3} alt={cinema.name} /> */}
          <div className="text" style={{ marginTop: 24, lineHeight: "1.8", textAlign: "justify" }}>
            <p style={{ fontWeight: "bold", color: "#F36F21", marginBottom: 8 }}>
              Với không gian thoáng đãng và hiện đại, {cinema.name} là lựa chọn hàng đầu của nhiều khán giả.
            </p>
            Hãy đến và tận hưởng những trải nghiệm điện ảnh đỉnh cao tại {cinema.name}, nơi mà mỗi bộ phim đều mang đến cảm giác sống động và cuốn hút.
          </div>
        </div>
      </section>
    </div>
  );
  
};

export default CinemaDetail;
