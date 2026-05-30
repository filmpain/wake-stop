import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = 'May 30, 2026';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto px-5 pt-[env(safe-area-inset-top)] pb-16">
        <div className="flex items-center gap-3 pt-4 pb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-xs">Last updated: {LAST_UPDATED}</p>

          <p>
            Wake Stop ("the app", "we", "us") is a transit alarm that wakes you up before you
            reach your destination stop. This policy explains what data we collect, why, and how
            it is used. By using Wake Stop you agree to this policy.
          </p>

          <Section title="Information we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Location data.</strong> While you are actively
                tracking a ride, the app accesses your device's GPS location to calculate how close
                you are to your destination and to trigger your wake-up alert. Location is processed
                on your device in real time and is <strong>not</strong> stored on our servers or
                shared with third parties.
              </li>
              <li>
                <strong className="text-foreground">Account information.</strong> When you sign in,
                we store your email address and name to identify your account.
              </li>
              <li>
                <strong className="text-foreground">App data.</strong> We store the data you create
                in the app — favorite stops, ride sessions, and your alert preferences — so they are
                available across your sessions.
              </li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To detect when you are approaching your stop and trigger sound/vibration alerts.</li>
              <li>To save and display your favorite stops and ride history.</li>
              <li>To remember your alert and appearance preferences.</li>
            </ul>
          </Section>

          <Section title="Location permission">
            <p>
              Location access is used solely to power the core alarm feature — alerting you as you
              near your stop. You can revoke location permission at any time in your device settings,
              but the wake-up alert will not work without it.
            </p>
          </Section>

          <Section title="Data sharing">
            <p>
              We do not sell your personal data. We do not share your location with advertisers or
              third parties. Transit route and stop information is sourced from public NYC MTA GTFS
              data.
            </p>
          </Section>

          <Section title="Data retention & deletion">
            <p>
              Your favorites, ride sessions, and settings are kept until you delete them. You can
              permanently delete all of your data at any time using the{' '}
              <strong className="text-foreground">Delete account</strong> option in Settings, which
              removes your favorites, ride history, and preferences.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p>Wake Stop is not directed to children under 13 and we do not knowingly collect their data.</p>
          </Section>

          <Section title="Contact us">
            <p>
              If you have questions about this policy or your data, contact us at{' '}
              <span className="text-foreground">support@wakestop.app</span>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-bold text-foreground mb-2">{title}</h2>
      {children}
    </div>
  );
}