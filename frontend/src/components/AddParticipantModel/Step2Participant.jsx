import React from "react";

export default function Step1Participant() {
    return (
        <div className=" flex justify-center  bg-white w-full">
            <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
                    <div>
                        <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                            رقم الهاتف<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder=" 05xxxxxxxxxx "
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                    </div>

                    <div>
                        <label className="block text-[14px] font-[700] mb-1.5 text-black">
                           الايميل<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="example@gmail.com"
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>



             

                <div>
                    <label className="block text-[14px] font-[700]  mb-1.5 text-black">
                        العنوان<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="أدخل العنوان"
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                 

            </form>
        </div>
    );
}
