import React from "react";
import { CheckCircle2, ListChecks, ArrowRight, Zap, Target, MessageSquare, LineChart } from "lucide-react";
import { useAppSelector } from "@/src/redux/hooks";

const WidgetInfoBox: React.FC = () => {
  const { app_name } = useAppSelector((state) => state.setting);

  return (
    <div className="space-y-8 mt-12 mb-8">
      {/* Section 1: Simple Steps */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
              <ListChecks className="w-6 h-6 text-primary dark:text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Simple Steps to add WhatsApp Button to your Website</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Generate & add a WhatsApp button to your website with <span className="font-bold text-primary dark:text-emerald-400">{app_name}</span> for FREE. Just follow the steps mentioned below to get started in minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 sm:p-5 p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 h-full">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Configure Widget</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{"Enter your WhatsApp number, customize colors, and set up your welcome message to match your brand's personality."}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:p-5 p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 h-full">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Generate Snippet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{'Once satisfied with the preview, click on "Save Changes" and then "Embed Code" to get your unique integration script.'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:p-5 p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 h-full">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Paste & Go Live</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Copy the generated script and paste it before the closing <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-(--dark-body) rounded text-xs">&lt;/body&gt;</code> tag of your website.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
            <h4 className="font-bold text-slate-800 dark:text-white mb-4">Pro Tips for Customization:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "CTA (Call to Action)", desc: "Use catchy text like 'Chat with Us' or 'Expert Support'." },
                { label: "Branding Assets", desc: "Upload your logo to build trust with your visitors." },
                { label: "Positioning", desc: "Place it where it doesn't block critical website elements." },
                { label: "Pre-filled Message", desc: "Help users start the conversation with a single tap." },
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{tip.label}: </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{tip.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Benefits */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary dark:text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Benefits of sharing WhatsApp Button</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Target size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">Higher Conversion</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">WhatsApp buttons have a 45-60% click-through rate, significantly higher than traditional forms.</p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">Personalization</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Engagement is interpersonal and human, allowing for a better customer experience.</p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <LineChart size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">Better Growth</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">7x better performance than emails or SMS in terms of speed and response rates.</p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <ArrowRight size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">Instant Leads</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{"Get the customer's name and number instantly, along with their consent for future updates."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetInfoBox;
