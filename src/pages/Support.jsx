import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Bell, ShieldCheck } from 'lucide-react';

const SUPPORT_EMAIL = 'support@wakestop.app';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto px-5 pt-[env(safe-area-inset-top)] pb-16">
        <div className="flex items-center gap-3 pt-4 pb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Support</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Wake Stop is a transit alarm that wakes you up before you reach your destination.
          Need help or want to report a problem? We're here.
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-primary text-primary-foreground font-bold mb-8"
        >
          <Mail className="w-5 h-5" />
          Email support
        </a>

        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">How it works</h2>
        <div className="space-y-3 mb-8">
          <Faq icon={MapPin} title="Why does it need my location?">
            We use your GPS only while you're tracking a ride, to detect how close you are to your
            stop and trigger your alert. Location is processed on your device and never sold or shared.
          </Faq>
          <Faq icon={Bell} title="My alarm didn't go off">
            Keep the app open during your ride and make sure sound/vibration are enabled in Settings →
            Alert Type. Underground signal can delay GPS, so set your alert a stop or two early.
          </Faq>
          <Faq icon={ShieldCheck} title="How do I delete my data?">
            Go to Settings → Danger Zone → Delete account to permanently remove your favorites,
            ride history, and preferences.
          </Faq>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/privacy')}
            className="underline hover:text-foreground"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}

function Faq({ icon: Icon, title, children }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-primary" />
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}