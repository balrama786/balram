/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { ContactSection } from "../../types/landingPage";
import { toast } from "sonner";
import { useContactInquiriesMutation } from "@/src/redux/api/contactApi";
import { AnyARecord } from "node:dns";

interface ConnectProps {
  data: ContactSection;
}

const Connect: React.FC<ConnectProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [inquiries] = useContactInquiriesMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await inquiries(formData).unwrap();
      toast.success(response.message || "Your inquiry has been submitted successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="bg-white py-[calc(30px+(100-30)*((100vw-320px)/(1920-320)))]">
      <div className="mx-[calc(16px+(195-16)*((100vw-320px)/(1920-320)))]">
        <div className="grid grid-cols-1 gap-[calc(30px+(64-30)*((100vw-320px)/(1920-320)))] lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-24">
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-[16px] font-bold uppercase tracking-[0.2em] text-primary">Connect With Us</span>
              <h2 className="mt-2.5 text-[clamp(1.5rem,1rem+2.5vw,2.875rem)] font-extrabold leading-[1.1] tracking-tight text-[#0F172A] whitespace-pre-wrap">
                {data.title}
              </h2>
              <p className="mt-2.5 text-[16px] leading-relaxed text-[#64748B] max-w-md whitespace-pre-wrap">{data.subtitle} <br /> {data.description}</p>
            </div>

            <div className="flex flex-col gap-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]">
              {data.phone_no && (
                <div className="flex items-center gap-4 text-[#0F172A]">
                  <div className="flex items-center justify-center rounded-lg text-primary">
                    <Phone size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[17px] font-semibold">{data.phone_no}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-4 text-[#0F172A]">
                  <div className="flex items-center justify-center rounded-lg text-primary">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[17px] font-semibold">{data.email}</span>
                </div>
              )}
            </div>
          </div>

          {data.form_enabled ? (
            <div className="w-full">
              <form className="grid grid-cols-1 gap-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] sm:grid-cols-2" onSubmit={handleSubmit}>
                <div className="sm:col-span-1">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-[15px] text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-1">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter Email"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-[15px] text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder="Subject"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-[15px] text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your needs..."
                    rows={6}
                    className="w-full form-contact resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-[15px] text-[#0F172A] transition-all placeholder:text-[#94A3B8] focus:border-primary focus:ring-1 focus:ring-primary"
                  ></textarea>
                </div>
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full sm:w-auto min-w-45 rounded-xl bg-primary px-10 py-4 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">Online contact form is currently disabled.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Connect;
