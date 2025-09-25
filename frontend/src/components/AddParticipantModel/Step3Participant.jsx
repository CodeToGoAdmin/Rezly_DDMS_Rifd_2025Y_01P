import React, { useState } from "react";
import { Mail, MessageSquare, Link as LinkIcon, Copy, Phone } from "lucide-react";

export default function HealthFormStep() {
    const [selectedMethod, setSelectedMethod] = useState("email");

    const copyLink = () => {
        navigator.clipboard.writeText("https://Rezly/Form/");
        alert("تم نسخ الرابط ✅");
    };

    return (
        <div className=" flex justify-center  bg-white w-full">
            <form className="w-[343px] flex flex-col gap-4 font-[Cairo]">

                {/* اختيار الفورم الصحي */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">اختر الفورم الصحي</label>
                    <select
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option>مثال: الفورم الصحي العام</option>
                    </select>
                </div>

                {/* طريقة الإرسال */}
                <div className="flex flex-col gap-3 mb-1.5">
                    <p className="text-[14px] font-[700] text-black">طريقة الإرسال</p>

                    {/* Email */}
                    <div
                        onClick={() => setSelectedMethod("email")}
                        className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-all ${selectedMethod === "email"
                            ? "border-[var(--color-purple)] bg-purple-50"
                            : "border-gray-300 hover:border-[var(--color-purple)]"
                            }`}
                    >
                        <div className="flex items-center gap-2">

                            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.8335 0.666687H2.16683C1.4335 0.666687 0.840163 1.26669 0.840163 2.00002L0.833496 10C0.833496 10.7334 1.4335 11.3334 2.16683 11.3334H12.8335C13.5668 11.3334 14.1668 10.7334 14.1668 10V2.00002C14.1668 1.26669 13.5668 0.666687 12.8335 0.666687ZM12.5668 3.50002L7.8535 6.44669C7.64016 6.58002 7.36016 6.58002 7.14683 6.44669L2.4335 3.50002C2.36665 3.46249 2.30811 3.41179 2.26142 3.35099C2.21473 3.29018 2.18087 3.22054 2.16188 3.14627C2.14289 3.072 2.13916 2.99464 2.15093 2.91889C2.1627 2.84314 2.18972 2.77056 2.23035 2.70555C2.27098 2.64055 2.32438 2.58446 2.38731 2.54068C2.45025 2.49691 2.52141 2.46636 2.59649 2.45089C2.67158 2.43541 2.74902 2.43533 2.82413 2.45065C2.89925 2.46597 2.97047 2.49638 3.0335 2.54002L7.50016 5.33335L11.9668 2.54002C12.0299 2.49638 12.1011 2.46597 12.1762 2.45065C12.2513 2.43533 12.3287 2.43541 12.4038 2.45089C12.4789 2.46636 12.5501 2.49691 12.613 2.54068C12.6759 2.58446 12.7293 2.64055 12.77 2.70555C12.8106 2.77056 12.8376 2.84314 12.8494 2.91889C12.8612 2.99464 12.8574 3.072 12.8384 3.14627C12.8195 3.22054 12.7856 3.29018 12.7389 3.35099C12.6922 3.41179 12.6337 3.46249 12.5668 3.50002Z" fill="#6A0EAD" />
                            </svg>

                            <span className="text-[12px] text-black">Email</span>
                        </div>
                        <input
                            type="radio"
                            checked={selectedMethod === "email"}
                            onChange={() => setSelectedMethod("email")}
                            className="text-[var(--color-purple)] focus:ring-[var(--color-purple)]"
                        />
                    </div>

                    {/* SMS */}
                    <div
                        onClick={() => setSelectedMethod("sms")}
                        className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-all ${selectedMethod === "sms"
                            ? "border-[var(--color-purple)] bg-purple-50"
                            : "border-gray-300 hover:border-[var(--color-purple)]"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8335 1.33331H3.16683C2.4335 1.33331 1.8335 1.93331 1.8335 2.66665V14.6666L4.50016 12H13.8335C14.5668 12 15.1668 11.4 15.1668 10.6666V2.66665C15.1668 1.93331 14.5668 1.33331 13.8335 1.33331ZM6.50016 7.33331H5.16683V5.99998H6.50016V7.33331ZM9.16683 7.33331H7.8335V5.99998H9.16683V7.33331ZM11.8335 7.33331H10.5002V5.99998H11.8335V7.33331Z" fill="#6A0EAD" />
                            </svg>

                            <span className="text-[12px] text-black">SMS</span>
                        </div>
                        <input
                            type="radio"
                            checked={selectedMethod === "sms"}
                            onChange={() => setSelectedMethod("sms")}
                            className="text-[var(--color-purple)] focus:ring-[var(--color-purple)]"
                        />
                    </div>

                    {/* Whatsapp */}
                    <div
                        onClick={() => setSelectedMethod("whatsapp")}
                        className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-all ${selectedMethod === "whatsapp"
                            ? "border-[var(--color-purple)] bg-purple-50"
                            : "border-gray-300 hover:border-[var(--color-purple)]"
                            }`}
                    >
                        <div className="flex items-center  gap-2">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.50066 1.33331C12.1827 1.33331 15.1673 4.31798 15.1673 7.99998C15.1673 11.682 12.1827 14.6666 8.50066 14.6666C7.3225 14.6687 6.16505 14.3569 5.14733 13.7633L1.83666 14.6666L2.73799 11.3546C2.14397 10.3366 1.83193 9.17866 1.83399 7.99998C1.83399 4.31798 4.81866 1.33331 8.50066 1.33331ZM6.22866 4.86665L6.09533 4.87198C6.00912 4.87792 5.92489 4.90056 5.84733 4.93865C5.77504 4.97965 5.70904 5.03084 5.65133 5.09065C5.57133 5.16598 5.52599 5.23131 5.47733 5.29465C5.23074 5.61525 5.09798 6.00886 5.09999 6.41331C5.10133 6.73998 5.18666 7.05798 5.31999 7.35531C5.59266 7.95665 6.04133 8.59331 6.63333 9.18331C6.77599 9.32531 6.916 9.46798 7.06666 9.60065C7.80228 10.2482 8.67885 10.7153 9.62666 10.9646L10.0053 11.0226C10.1287 11.0293 10.252 11.02 10.376 11.014C10.5701 11.0037 10.7597 10.9512 10.9313 10.86C11.0186 10.8149 11.1038 10.7659 11.1867 10.7133C11.1867 10.7133 11.2149 10.6942 11.27 10.6533C11.36 10.5866 11.4153 10.5393 11.49 10.4613C11.546 10.4035 11.5927 10.3364 11.63 10.26C11.682 10.1513 11.734 9.94398 11.7553 9.77131C11.7713 9.63931 11.7667 9.56731 11.7647 9.52265C11.762 9.45131 11.7027 9.37731 11.638 9.34598L11.25 9.17198C11.25 9.17198 10.67 8.91931 10.3153 8.75798C10.2782 8.74182 10.2384 8.73256 10.198 8.73065C10.1524 8.72587 10.1063 8.73096 10.0628 8.74557C10.0193 8.76018 9.97948 8.78396 9.946 8.81531C9.94266 8.81398 9.89799 8.85198 9.41599 9.43598C9.38833 9.47315 9.35022 9.50125 9.30653 9.51668C9.26284 9.53212 9.21554 9.53419 9.17066 9.52265C9.12721 9.51107 9.08466 9.49636 9.04333 9.47865C8.96066 9.44398 8.93199 9.43065 8.87533 9.40665C8.49258 9.23992 8.13829 9.0143 7.82533 8.73798C7.74133 8.66465 7.66333 8.58465 7.58333 8.50731C7.32107 8.25612 7.0925 7.97197 6.90333 7.66198L6.86399 7.59865C6.83617 7.55584 6.81335 7.50999 6.79599 7.46198C6.77066 7.36398 6.83666 7.28531 6.83666 7.28531C6.83666 7.28531 6.99866 7.10798 7.07399 7.01198C7.14733 6.91865 7.20933 6.82798 7.24933 6.76331C7.32799 6.63665 7.35266 6.50665 7.31133 6.40598C7.12466 5.94998 6.93177 5.49642 6.73266 5.04531C6.69333 4.95598 6.57666 4.89198 6.47066 4.87931C6.43466 4.87487 6.39866 4.87131 6.36266 4.86865C6.27315 4.86351 6.18339 4.8644 6.09399 4.87131L6.22866 4.86665Z" fill="#6A0EAD" />
                            </svg>

                            <span className="text-[12px] text-black">Whatsapp</span>
                        </div>
                        <input
                            type="radio"
                            checked={selectedMethod === "whatsapp"}
                            onChange={() => setSelectedMethod("whatsapp")}
                            className="text-[var(--color-purple)] focus:ring-[var(--color-purple)]"
                        />
                    </div>
                </div>

                {/* رابط  */}
                <div className="flex justify-between rounded-xl items-center bg-gray-100 px-2 py-2">
                     <button
                        onClick={copyLink}
                        className="bg-[var(--color-purple)] rounded-xl text-white px-4 py-2 text-[12px] font-medium hover:bg-[var(--color-purple)] transition-all"
                    >
                        نسخ
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-[400] text-black truncate">
                            Https://rezly/form/
                        </span>
                        <LinkIcon className="text-gray-400" size={18} />
                    </div>

                   
                </div>

            </form>


        </div>
    );
}
