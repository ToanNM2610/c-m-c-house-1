'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ShieldCheck, RotateCw, AlertCircle, Check } from 'lucide-react';

export interface ChallengeState {
  challengeToken: string;
  challengeAnswer: string;
  websiteUrl: string;
  companyFax: string;
  isReady: boolean;
  isAnswered: boolean;
  isValid: boolean;
}

export interface HumanChallengeBoxRef {
  refresh: () => Promise<void>;
  reset: () => void;
  getState: () => ChallengeState;
}

export interface HumanChallengeBoxProps {
  onChange?: (state: ChallengeState) => void;
  onStateChange?: (state: ChallengeState) => void;
  disabled?: boolean;
  isEn?: boolean;
  className?: string;
}

const HumanChallengeBox = forwardRef<HumanChallengeBoxRef, HumanChallengeBoxProps>(
  ({ onChange, onStateChange, disabled = false, isEn = false, className = '' }, ref) => {
    const [question, setQuestion] = useState<string>('');
    const [challengeToken, setChallengeToken] = useState<string>('');
    const [challengeAnswer, setChallengeAnswer] = useState<string>('');
    const [websiteUrl, setWebsiteUrl] = useState<string>('');
    const [companyFax, setCompanyFax] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const notifyParent = useCallback(
      (token: string, ans: string, hpWeb: string, hpFax: string) => {
        const state: ChallengeState = {
          challengeToken: token,
          challengeAnswer: ans,
          websiteUrl: hpWeb,
          companyFax: hpFax,
          isReady: Boolean(token),
          isAnswered: ans.trim().length > 0,
          isValid: Boolean(token && ans.trim().length > 0),
        };
        if (onChange) onChange(state);
        if (onStateChange) onStateChange(state);
      },
      [onChange, onStateChange]
    );

    const fetchChallenge = useCallback(async () => {
      setLoading(true);
      setError(null);
      setChallengeAnswer('');
      try {
        const res = await fetch('/api/security/challenge', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!res.ok) {
          throw new Error(isEn ? 'Failed to fetch challenge' : 'Không tải được mã xác minh');
        }

        const data = await res.json();
        const payload = data.data || data.challenge || data;
        const q =
          payload?.question ||
          data.question ||
          (data.a !== undefined && data.b !== undefined
            ? `${data.a} + ${data.b}`
            : '');
        const tok =
          payload?.token ||
          data.token ||
          data.challengeToken ||
          payload?.challengeToken ||
          '';

        setQuestion(q);
        setChallengeToken(tok);
        notifyParent(tok, '', websiteUrl, companyFax);
      } catch (err: any) {
        console.error('HumanChallengeBox fetch error:', err);
        setError(err.message || (isEn ? 'Verification error' : 'Lỗi kết nối bảo mật'));
        notifyParent('', '', websiteUrl, companyFax);
      } finally {
        setLoading(false);
      }
    }, [isEn, websiteUrl, companyFax, notifyParent]);

    useEffect(() => {
      fetchChallenge();
    }, [fetchChallenge]);

    useImperativeHandle(
      ref,
      () => ({
        refresh: async () => {
          await fetchChallenge();
        },
        reset: () => {
          setChallengeAnswer('');
          notifyParent(challengeToken, '', websiteUrl, companyFax);
        },
        getState: () => ({
          challengeToken,
          challengeAnswer,
          websiteUrl,
          companyFax,
          isReady: Boolean(challengeToken),
          isAnswered: challengeAnswer.trim().length > 0,
          isValid: Boolean(challengeToken && challengeAnswer.trim().length > 0),
        }),
      }),
      [fetchChallenge, challengeToken, challengeAnswer, websiteUrl, companyFax, notifyParent]
    );

    const handleAnswerChange = (val: string) => {
      // Keep only numbers or clean string
      const sanitized = val.replace(/[^0-9\-]/g, '');
      setChallengeAnswer(sanitized);
      notifyParent(challengeToken, sanitized, websiteUrl, companyFax);
    };

    const handleWebUrlChange = (val: string) => {
      setWebsiteUrl(val);
      notifyParent(challengeToken, challengeAnswer, val, companyFax);
    };

    const handleFaxChange = (val: string) => {
      setCompanyFax(val);
      notifyParent(challengeToken, challengeAnswer, websiteUrl, val);
    };

    const displayFormula = question
      ? question.includes('=')
        ? question
        : `${question} = ?`
      : '...';

    return (
      <div className={`space-y-1.5 ${className}`}>
        {/* Compact Theme-Aware Math Challenge Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-forest-50/70 dark:bg-forest-950/60 rounded-xl border border-forest-200 dark:border-forest-700/80 transition-all text-ink-primary">
          {/* Left: Shield icon + Label + Question Formula */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-forest-100 dark:bg-forest-800/80 flex items-center justify-center flex-shrink-0 text-accent-botanical">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-mono text-ink-muted uppercase tracking-wider whitespace-nowrap">
                {isEn ? 'Security:' : 'Xác minh bảo mật:'}
              </span>

              {loading ? (
                <span className="inline-block px-2.5 py-1 rounded-md bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-muted animate-pulse">
                  {isEn ? 'Generating math challenge...' : 'Đang tạo câu hỏi...'}
                </span>
              ) : error ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 font-mono font-bold text-accent-botanical text-xs shadow-sm">
                  {displayFormula}
                </span>
              )}
            </div>
          </div>

          {/* Right: Numeric Input + Refresh Button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={disabled || loading || Boolean(error)}
                value={challengeAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={isEn ? 'Answer' : 'Đáp án'}
                aria-label={isEn ? 'Math challenge answer' : 'Đáp án phép tính'}
                className="w-20 px-2.5 py-1.5 text-center text-xs font-mono font-bold bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 rounded-lg text-ink-primary placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-botanical focus:ring-1 focus:ring-accent-botanical disabled:opacity-50 transition-all"
              />
              {challengeAnswer.trim().length > 0 && (
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={disabled || loading}
              onClick={fetchChallenge}
              title={isEn ? 'Get another question' : 'Đổi phép tính khác'}
              aria-label={isEn ? 'Get another question' : 'Đổi phép tính khác'}
              className="p-2 text-ink-muted hover:text-accent-botanical hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg border border-transparent hover:border-forest-200 dark:hover:border-forest-700 disabled:opacity-50 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-accent-botanical' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hidden Off-Screen Honeypot Trap Inputs (Strictly for Bots) */}
        <div
          aria-hidden="true"
          tabIndex={-1}
          className="absolute -left-[9999px] -top-[9999px] w-0 h-0 opacity-0 pointer-events-none overflow-hidden select-none"
        >
          <label htmlFor="hp_website_url">Website URL (leave empty)</label>
          <input
            id="hp_website_url"
            type="text"
            name="websiteUrl"
            value={websiteUrl}
            onChange={(e) => handleWebUrlChange(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />

          <label htmlFor="hp_company_fax">Company Fax (leave empty)</label>
          <input
            id="hp_company_fax"
            type="text"
            name="companyFax"
            value={companyFax}
            onChange={(e) => handleFaxChange(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>
    );
  }
);

HumanChallengeBox.displayName = 'HumanChallengeBox';

export default HumanChallengeBox;
