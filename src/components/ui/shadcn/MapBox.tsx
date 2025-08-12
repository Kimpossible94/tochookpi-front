import React, { useEffect } from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

interface MapBoxProps {
    location: { lat: number; lng: number; name: string } | null; // 선택된 장소 데이터
}

const MapBox: React.FC<MapBoxProps> = ({ location }) => {
    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오맵 SDK가 로드되지 않았습니다.");
            return;
        }

        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 기본 위치
            level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 선택된 장소가 있으면 지도에 표시
        if (location) {
            const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${location.name}</div>`,
            });
            infowindow.open(map, marker);

            // 지도 중심 이동
            map.setCenter(markerPosition);
        }
    }, [location]);

    return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default MapBox;
