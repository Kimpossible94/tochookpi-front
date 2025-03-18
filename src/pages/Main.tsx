import * as React from "react";
import {Link} from "react-router-dom";
import mainImage from "../assets/main.png";
import mainImage2 from "../assets/main2.png";

const Main = () => {
    return (
        <div className="h-screen flex flex-col justify-center space-y-10 relative">
            <section className="flex items-center justify-between my-20 px-28 relative w-full">
                <div className="max-w-xl relative z-10">
                    <p className="pl-1 text-6xl font-medium leading-tight">
                        토축피 모여라에 <br />
                    </p>
                    <p className="pl-1 text-6xl font-extrabold leading-tight mb-6">
                        오신 걸 환영합니다
                    </p>
                    <p className="pl-1 text-lg opacity-80 mb-8">
                        다양한 모임을 만들고 친구들과 함께하세요!
                    </p>
                    <Link to="/create-meeting">
                        <button
                            className="py-3 px-6 text-xl text-white bg-black rounded-3xl hover:opacity-80 focus:outline-none"
                        >
                            모임 만들기
                        </button>
                    </Link>
                </div>

                <div className="relative w-1/2 flex">
                    <img
                        src={mainImage}
                        alt="메인 이미지"
                        className="w-[80%] h-auto object-cover rounded-2xl relative left-0"
                    />
                    <img
                        src={mainImage2}
                        alt="메인 이미지2"
                        className="absolute bottom-[-20%] left-[50%] w-[60%] object-cover rounded-2xl rotate-6"
                    />
                </div>
            </section>
        </div>
    );
};

export default Main;
