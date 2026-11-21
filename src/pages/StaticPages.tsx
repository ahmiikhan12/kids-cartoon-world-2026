import React, { useState } from 'react';
import { CheckCircle2, Lock, Mail, Send, ShieldCheck } from 'lucide-react';
import type { AppRoute } from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { signInWithGoogle } from '../lib/firebase';
import { submitParentInquiry } from '../services/inquiryService';
import type { ParentInquiry } from '../types/video';

interface StaticPageProps {
  onNavigate: (next: AppRoute) => void;
}

function InfoPageNav({
  active,
  onNavigate,
}: {
  active: 'about' | 'contact' | 'privacy' | 'terms';
  onNavigate: (next: AppRoute) => void;
}) {
  const items: { id: 'about' | 'contact' | 'privacy' | 'terms'; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Use' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate({ page: item.id })}
          className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
            active === item.id
              ? 'bg-sky-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function AboutPage({ onNavigate }: StaticPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <InfoPageNav active="about" onNavigate={onNavigate} />

      <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10">
        <p className="text-xs font-semibold text-sky-700">About Kids Cartoon World</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
          Warm, joyful storytelling built for children and families
        </h1>

        <p className="mt-5 text-base text-slate-700 leading-relaxed">
          Kids Cartoon World is a family-friendly destination designed to bring together funny
          animal cartoons, classic Urdu moral stories, gentle educational videos, and calm bedtime
          tales in one distraction-free home.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Age-Appropriate & Calm Design
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every page is organized with clear thumbnails, gentle colors, large mobile touch
              targets, and zero open comment sections or stranger chat boxes.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Urdu Heritage & Positive Values
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Alongside playful cartoons and early learning lessons, we highlight Urdu moral stories
              that encourage honesty, patience, gratitude, and kindness.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Original & Authorized Content Only
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              We never download or copy copyrighted cartoons from other creators. Only clearly
              labeled original sample demos and videos owned or properly licensed for embedding by
              the website owner are published here.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Privacy-First for Children
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Children never need to register an account, share their name, or enter an email to
              watch videos. Embedded videos use privacy-enhanced player modes wherever supported.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

export function ContactPage({ onNavigate }: StaticPageProps) {
  const { user } = useAppContext();
  const [senderName, setSenderName] = useState(user?.displayName || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [topic, setTopic] = useState<ParentInquiry['topic']>('General Question');
  const [message, setMessage] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParentSignIn = async () => {
    setErrorMsg(null);
    try {
      const signedIn = await signInWithGoogle();
      if (signedIn.displayName && !senderName) setSenderName(signedIn.displayName);
      if (signedIn.email && !senderEmail) setSenderEmail(signedIn.email);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to sign in right now. Please try again.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!user) {
      setErrorMsg('Please verify as a parent or guardian with Google Sign-In first.');
      return;
    }
    setSubmitting(true);
    try {
      await submitParentInquiry(
        {
          senderName,
          senderEmail,
          topic,
          message,
          isAdultConfirmed,
        },
        user.uid
      );
      setSubmitted(true);
      setMessage('');
      setIsAdultConfirmed(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send message. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <InfoPageNav active="contact" onNavigate={onNavigate} />

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10">
        <p className="text-xs font-semibold text-sky-700">For Parents, Guardians & Rights Holders (18+)</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Us
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          To protect children&apos;s privacy, this contact form is strictly intended for adult
          parents, guardians, educators, or content rights holders. Children should not submit
          personal information on this website.
        </p>

        {submitted ? (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Message received safely
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                Thank you for reaching out. Your message has been stored securely for the website
                owner to review.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 min-h-[44px] rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : !user ? (
          <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Adult Verification Required Before Messaging
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  To prevent automated spam and ensure children do not accidentally send personal
                  details, parents and guardians sign in with a verified Google account to submit an
                  inquiry. Your message is private and visible only to you and the website owner.
                </p>
                <button
                  type="button"
                  onClick={handleParentSignIn}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Sign in with Google (Parents / 18+)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800">
                  Your Name (Parent / Guardian)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800">
                  Contact Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  maxLength={120}
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-sm font-semibold text-slate-800">
                Topic
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as ParentInquiry['topic'])}
                className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
              >
                <option value="General Question">General Question</option>
                <option value="Content Feedback">Content Feedback</option>
                <option value="Rights & Permissions">Rights & Permissions</option>
                <option value="Privacy Inquiry">Privacy Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                minLength={10}
                maxLength={1000}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your feedback, question, or rights notice..."
                className="mt-1.5 w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdultConfirmed}
                onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                required
                className="mt-1 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>
                I confirm I am an adult parent, guardian, or authorized representative (18+) and not
                submitting personal information about a child.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export function PrivacyPolicyPage({ onNavigate }: StaticPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <InfoPageNav active="privacy" onNavigate={onNavigate} />

      <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6 text-slate-700">
        <div>
          <p className="text-xs font-semibold text-emerald-700">Child-Directed Privacy Commitment</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-500">Effective Date: November 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. Minimal Data Collection & Children&apos;s Privacy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Kids Cartoon World is designed for children and families. We do not ask children to
            create accounts, do not offer public comment boxes or chat rooms, and do not knowingly
            collect personal information from children under 13 (or the applicable age of digital
            consent in your region, such as under COPPA or GDPR-K).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            2. Embedded Third-Party Video Players
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            When the website owner embeds authorized videos from YouTube or Vimeo, we use
            privacy-enhanced player modes (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">youtube-nocookie.com</code>{' '}
            and Vimeo Do-Not-Track <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">dnt=1</code>)
            to minimize third-party cookies. Third-party hosts may still process standard technical
            connection data needed to deliver video playback.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. Child-Directed Advertising Policy (Future Monetization)
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Currently, this website displays zero advertisements. If the website owner later applies
            for and receives approval for Google AdSense or another advertising program, the site
            must be configured for child-directed treatment (such as Google&apos;s Tag for
            Child-Directed Treatment / non-personalized ads only) in full compliance with Google
            Publisher Policies, COPPA, and applicable family-safety regulations. Personalized
            behavioral tracking ads are strictly prohibited on child-directed content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            4. Adult Parent Contact Messages
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Only adults (parents, guardians, or rights holders aged 18+) may submit a contact
            message via our Contact Us page. Submitted messages are stored securely in Firestore,
            accessible exclusively to the website owner, and used solely to respond to the inquiry
            or remove content upon request. Parents may request deletion of their message at any
            time.
          </p>
        </section>
      </article>
    </main>
  );
}

export function TermsPage({ onNavigate }: StaticPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <InfoPageNav active="terms" onNavigate={onNavigate} />

      <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6 text-slate-700">
        <div>
          <p className="text-xs font-semibold text-sky-700">Website Guidelines</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Use
          </h1>
          <p className="mt-2 text-xs text-slate-500">Effective Date: November 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. Family-Safe Use
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Kids Cartoon World is provided for personal, non-commercial family viewing and early
            learning. Parents and guardians are encouraged to supervise young children&apos;s screen
            time according to family preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            2. Intellectual Property & Authorized Video Embedding
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We respect the copyrights of all animators, storytellers, and video creators. Videos
            published on Kids Cartoon World must be original works created by the website owner,
            public-domain / properly licensed materials, or authorized embeds (such as official
            YouTube embeds permitted by the copyright holder). Downloading, re-uploading, or copying
            copyrighted cartoons without permission is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. Copyright & Content Removal Requests
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            If you believe any embedded link or material on this site infringes your copyright or is
            not appropriate for children, please contact us through the Contact Us page (selecting
            &quot;Rights &amp; Permissions&quot;) so the website owner can review and remove it
            promptly.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Built with child safety, copyright respect, and family trust first.</span>
        </div>
      </article>
    </main>
  );
}
