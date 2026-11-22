'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Star,
  Share2,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Loader2,
  Save,
  MessageCircle,
  ExternalLink,
  Send,
  Plus,
  Edit2,
  Key,
  ShieldCheck,
  UserCheck,
  UserX,
  HelpCircle,
  RotateCw,
  Shuffle,
  Sliders,
} from 'lucide-react';
import {
  ContactSubmission,
  GuestComment,
  CafeSettings,
  GmailConfigData,
  GmailRecipientItem,
} from '@/types';
import { extractGoogleSiteVerificationToken } from '@/lib/integrations';
import AdminAntiSpamManager from './AdminAntiSpamManager';

export interface AdminInteractionsManagerProps {
  initialTab?: 'inbox' | 'reviews' | 'chat' | 'contacts' | 'comments' | 'gmail' | 'antispam' | 'integrations';
  initialView?: 'inbox' | 'reviews' | 'chat' | 'contacts' | 'comments' | 'gmail' | 'antispam' | 'integrations';
}

export default function AdminInteractionsManager({
  initialTab,
  initialView,
}: AdminInteractionsManagerProps = {}) {
  const getStartingTab = (): 'contacts' | 'comments' | 'gmail' | 'antispam' | 'integrations' => {
    const raw = initialTab || initialView;
    if (raw === 'inbox' || raw === 'contacts') return 'contacts';
    if (raw === 'reviews' || raw === 'comments') return 'comments';
    if (raw === 'chat' || raw === 'integrations') return 'integrations';
    if (raw === 'gmail') return 'gmail';
    if (raw === 'antispam') return 'antispam';
    return 'contacts';
  };

  const [tab, setTab] = useState<'contacts' | 'comments' | 'gmail' | 'antispam' | 'integrations'>(getStartingTab);

  // Sync tab if initialTab or initialView changes from parent navigation
  useEffect(() => {
    const raw = initialTab || initialView;
    if (!raw) return;
    if (raw === 'inbox' || raw === 'contacts') setTab('contacts');
    else if (raw === 'reviews' || raw === 'comments') setTab('comments');
    else if (raw === 'chat' || raw === 'integrations') setTab('integrations');
    else if (raw === 'gmail') setTab('gmail');
    else if (raw === 'antispam') setTab('antispam');
  }, [initialTab, initialView]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [settings, setSettings] = useState<Partial<CafeSettings>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Gmail SMTP State
  const [gmailConfig, setGmailConfig] = useState<GmailConfigData | null>(null);
  const [gmailRecipients, setGmailRecipients] = useState<GmailRecipientItem[]>([]);
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [savingGmailConfig, setSavingGmailConfig] = useState(false);
  const [testingGmail, setTestingGmail] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('');

  // Recipient Modal State
  const [recipientModalOpen, setRecipientModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Partial<GmailRecipientItem> | null>(null);
  const [savingRecipient, setSavingRecipient] = useState(false);

  // Contact detail modal & Reply modal
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [replyingContact, setReplyingContact] = useState<ContactSubmission | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Settings saving state
  const [savingSettings, setSavingSettings] = useState(false);

  // Review Showcase CMS State (Module 4)
  const [reviewMode, setReviewMode] = useState<'AUTO_RANDOM' | 'MANUAL'>('AUTO_RANDOM');
  const [reviewInterval, setReviewInterval] = useState<number>(6);
  const [savingReviewSettings, setSavingReviewSettings] = useState(false);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [contRes, commRes, settRes, gmailCfgRes, gmailRecRes] = await Promise.all([
        fetch('/api/contact', { credentials: 'include' }),
        fetch('/api/comments', { credentials: 'include' }),
        fetch('/api/settings', { credentials: 'include' }),
        fetch('/api/gmail/config', { credentials: 'include' }),
        fetch('/api/gmail/recipients', { credentials: 'include' }),
      ]);

      const contJson = await contRes.json();
      const commJson = await commRes.json();
      const settJson = await settRes.json();
      const gmailCfgJson = await gmailCfgRes.json();
      const gmailRecJson = await gmailRecRes.json();

      if (contJson.success) setContacts(contJson.data || []);
      if (commJson.success) setComments(commJson.data || []);
      if (settJson && typeof settJson === 'object') {
        setSettings(settJson);
        if (settJson.reviewDisplayMode) setReviewMode(settJson.reviewDisplayMode);
        if (settJson.reviewAutoIntervalSec) setReviewInterval(Number(settJson.reviewAutoIntervalSec) || 6);
      }

      if (gmailCfgJson.success && gmailCfgJson.data) {
        setGmailConfig(gmailCfgJson.data);
        setAppPasswordInput('');
      }

      if (gmailRecJson.success && Array.isArray(gmailRecJson.data)) {
        setGmailRecipients(gmailRecJson.data);
      }
    } catch {
      showToast('error', 'Lỗi khi tải dữ liệu tương tác');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update Contact Status
  const handleUpdateContactStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã cập nhật trạng thái thư sang: ${status}`);
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status: status as any });
        }
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi cập nhật');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  // Delete Contact
  const handleDeleteContact = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá thư liên hệ này?')) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
        showToast('success', 'Đã xoá thư liên hệ thành công');
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi xoá thư liên hệ');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi xoá thư liên hệ');
    }
  };

  // Retry Contact Email Notification
  const handleRetryEmail = async (id: string) => {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/gmail/retry/${id}`, { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Đã gửi lại email thành công!');
        fetchData();
      } else {
        showToast('error', json.message || json.error || 'Gửi lại email thất bại');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi gửi lại email');
    } finally {
      setRetryingId(null);
    }
  };

  // Open Reply Modal
  const handleOpenReplyModal = (contact: ContactSubmission) => {
    setReplyingContact(contact);
    setReplySubject(`[Cẩm Cù House] Phản hồi lời nhắn: ${contact.subject || 'Liên hệ khách hàng'}`);
    setReplyBody(
      `Chào ${contact.fullName},\n\nCảm ơn bạn đã quan tâm và liên hệ đến Cẩm Cù House. Về lời nhắn của bạn, chúng tôi xin phản hồi như sau:\n\n\n\nNếu bạn cần thêm thông tin, xin đừng ngần ngại phản hồi lại email này hoặc gọi hotline 0382 851 688.\n\nTrân trọng,\nĐội ngũ Cẩm Cù House — Bờ Suối Mát`
    );
  };

  // Send Admin Reply Email
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingContact) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/gmail/reply/${replyingContact.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          replySubject,
          replyBody,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Đã gửi phản hồi thành công!');
        setReplyingContact(null);
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi khi gửi phản hồi');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi gửi phản hồi');
    } finally {
      setSendingReply(false);
    }
  };

  // Update Comment
  const handleUpdateComment = async (id: string, status: string, isFeatured?: boolean) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status, isFeatured }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã cập nhật đánh giá');
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi cập nhật');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  // Toggle Pin on Comment via PATCH /api/comments/[id]
  const handleTogglePinComment = async (id: string, currentFeatured: boolean) => {
    // If admin is pinning and already 3 pinned, enforce max 3
    if (!currentFeatured) {
      const currentlyPinned = comments.filter((c) => c.isFeatured && c.status === 'APPROVED');
      if (currentlyPinned.length >= 3) {
        showToast('error', 'Đang ghim hiển thị ngoài web: 3/3 (Đã đạt tối đa). Vui lòng bỏ ghim 1 đánh giá trước khi chọn thêm.');
        return;
      }
    }

    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(
          'success',
          !currentFeatured ? 'Đã ghim đánh giá hiển thị ngoài web' : 'Đã bỏ ghim đánh giá'
        );
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isFeatured: !currentFeatured } : c))
        );
      } else {
        showToast('error', json.error || 'Lỗi cập nhật ghim');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    }
  };

  // Save Review Showcase CMS Settings (Module 4)
  const handleSaveReviewSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingReviewSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reviewDisplayMode: reviewMode,
          reviewAutoIntervalSec: Number(reviewInterval) || 6,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã lưu cấu hình hiển thị đánh giá thành công');
        setSettings((prev) => ({
          ...prev,
          reviewDisplayMode: reviewMode,
          reviewAutoIntervalSec: Number(reviewInterval) || 6,
        }));
      } else {
        showToast('error', json.error || 'Lỗi lưu cấu hình đánh giá');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    } finally {
      setSavingReviewSettings(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá đánh giá này?')) return;
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setComments((prev) => prev.filter((c) => c.id !== id));
        showToast('success', 'Đã xoá đánh giá thành công');
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi xoá đánh giá');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi xoá đánh giá');
    }
  };

  // Save Quick Chat & Marketing Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã lưu cấu hình kênh liên hệ & mã theo dõi thành công');
      } else {
        showToast('error', json.error || 'Lỗi lưu cấu hình');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu');
    } finally {
      setSavingSettings(false);
    }
  };

  // Save Gmail SMTP Configuration
  const handleSaveGmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailConfig) return;

    setSavingGmailConfig(true);
    try {
      const payload: any = {
        isEnabled: gmailConfig.isEnabled,
        senderName: gmailConfig.senderName,
        senderEmail: gmailConfig.senderEmail,
        autoReplyEnabled: gmailConfig.autoReplyEnabled,
        autoReplySubject: gmailConfig.autoReplySubject,
        autoReplyBody: gmailConfig.autoReplyBody,
      };

      if (appPasswordInput.trim().length > 0) {
        payload.appPassword = appPasswordInput.trim();
      }

      const res = await fetch('/api/gmail/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setGmailConfig(json.data);
        setAppPasswordInput('');
        showToast('success', 'Đã cập nhật cấu hình Gmail SMTP thành công!');
      } else {
        showToast('error', json.error || 'Không thể lưu cấu hình Gmail');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    } finally {
      setSavingGmailConfig(false);
    }
  };

  // Test Gmail SMTP Connection
  const handleTestGmail = async (targetEmail?: string) => {
    setTestingGmail(true);
    try {
      const res = await fetch('/api/gmail/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          targetEmail: targetEmail || testEmailInput || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Kết nối Gmail SMTP thành công!');
      } else {
        showToast('error', json.message || 'Lỗi kiểm tra kết nối Gmail');
      }
    } catch {
      showToast('error', 'Lỗi mạng khi kết nối máy chủ');
    } finally {
      setTestingGmail(false);
    }
  };

  // Save / Update Recipient
  const handleSaveRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipient || !editingRecipient.email) return;

    setSavingRecipient(true);
    try {
      const isEdit = !!editingRecipient.id;
      const url = isEdit ? `/api/gmail/recipients/${editingRecipient.id}` : '/api/gmail/recipients';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: editingRecipient.email,
          label: editingRecipient.label,
          receiveSubjects: editingRecipient.receiveSubjects || 'ALL',
          isActive: editingRecipient.isActive ?? true,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isEdit ? 'Đã cập nhật người nhận!' : 'Đã thêm người nhận mới!');
        setRecipientModalOpen(false);
        setEditingRecipient(null);
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi thao tác người nhận');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu người nhận');
    } finally {
      setSavingRecipient(false);
    }
  };

  // Toggle Recipient Active
  const handleToggleRecipientActive = async (recipient: GmailRecipientItem) => {
    try {
      const res = await fetch(`/api/gmail/recipients/${recipient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !recipient.isActive }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã ${!recipient.isActive ? 'kích hoạt' : 'tạm dừng'} nhận tin cho ${recipient.email}`);
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi cập nhật');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  // Delete Recipient
  const handleDeleteRecipient = async (id: string, email: string) => {
    if (!confirm(`Bạn có chắc muốn xoá ${email} khỏi danh sách nhận thông báo?`)) return;
    try {
      const res = await fetch(`/api/gmail/recipients/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setGmailRecipients((prev) => prev.filter((r) => r.id !== id));
        showToast('success', `Đã xoá ${email} khỏi danh sách nhận thông báo`);
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi xoá người nhận');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi xoá người nhận');
    }
  };

  const newContactCount = contacts.filter((c) => c.status === 'NEW').length;
  const pendingCommentCount = comments.filter((c) => c.status === 'PENDING').length;
  const isGmailConfigured = gmailConfig?.hasAppPassword && gmailConfig?.senderEmail;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-mono">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>MODULE 4: TƯƠNG TÁC KHÁCH HÀNG & GMAIL SMTP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Hộp Thư Liên Hệ, Duyệt Đánh Giá & Cấu Hình Gmail
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Quản trị phản hồi từ khách, phê duyệt bình luận, cấu hình chuyển tiếp Gmail SMTP và tích hợp kênh chat trực tuyến.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('contacts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                tab === 'contacts' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Thư liên hệ ({contacts.length})</span>
              {newContactCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {newContactCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('comments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                tab === 'comments' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Duyệt đánh giá ({comments.length})</span>
              {pendingCommentCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                  {pendingCommentCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('gmail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                tab === 'gmail' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cấu hình Gmail</span>
              {isGmailConfigured ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="SMTP đã sẵn sàng" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Chưa hoàn tất cài đặt SMTP" />
              )}
            </button>
            <button
              onClick={() => setTab('antispam')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                tab === 'antispam' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khiên Chống Spam</span>
            </button>
            <button
              onClick={() => setTab('integrations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'integrations' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kênh Chat & Pixel
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CONTACTS TAB */}
      {tab === 'contacts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Điện thoại / Email</th>
                  <th className="py-3 px-4">Chủ đề & Lời nhắn</th>
                  <th className="py-3 px-4">Trạng thái xử lý</th>
                  <th className="py-3 px-4">Thông báo Gmail</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 font-mono">
                      Chưa có lời nhắn nào từ khách hàng
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{c.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <div>
                          <a href={`tel:${c.phone}`} className="hover:underline text-emerald-700 font-bold">
                            {c.phone}
                          </a>
                        </div>
                        {c.email ? (
                          <div className="text-[10px] text-slate-400">{c.email}</div>
                        ) : (
                          <div className="text-[10px] text-slate-300 italic">Không có email</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-slate-700">
                        {c.subject && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                c.subject.includes('BBQ')
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : c.subject.includes('Góp ý')
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {c.subject}
                            </span>
                          </div>
                        )}
                        <div className="line-clamp-2 text-slate-600">{c.message}</div>
                        {c.repliedAt && (
                          <div className="text-[10px] text-emerald-600 font-mono mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã phản hồi email: {new Date(c.repliedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                            c.status === 'NEW'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : c.status === 'READ'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : c.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="NEW">MỚI (Chưa xem)</option>
                          <option value="READ">ĐÃ ĐỌC</option>
                          <option value="RESOLVED">ĐÃ XỬ LÝ XONG</option>
                          <option value="SPAM">SPAM</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {c.emailStatus === 'SENT' ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold"
                              title={`Đã gửi tới: ${c.emailSentTo || 'Người nhận'}`}
                            >
                              <Check className="w-3 h-3" /> Đã gửi Gmail
                            </span>
                          ) : c.emailStatus === 'FAILED' ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold"
                              title={c.emailError || 'Gửi thất bại'}
                            >
                              <AlertCircle className="w-3 h-3" /> Lỗi gửi
                            </span>
                          ) : c.emailStatus === 'DISABLED' ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                              Đã tắt SMTP
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                              Chưa cấu hình
                            </span>
                          )}

                          {/* Quick Retry Button */}
                          <button
                            onClick={() => handleRetryEmail(c.id)}
                            disabled={retryingId === c.id}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                            title="Gửi lại thông báo qua Gmail"
                          >
                            <RotateCw className={`w-3 h-3 ${retryingId === c.id ? 'animate-spin text-emerald-600' : ''}`} />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.email && (
                            <button
                              onClick={() => handleOpenReplyModal(c)}
                              className="px-2 py-1 text-xs font-mono bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                              title="Phản hồi email khách hàng"
                            >
                              <Send className="w-3 h-3" />
                              <span>Phản hồi</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedContact(c)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xoá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GMAIL CONFIGURATION & RECIPIENTS TAB */}
      {tab === 'gmail' && (
        <div className="space-y-6">
          {/* Card 1: SMTP Sender Configuration */}
          <form onSubmit={handleSaveGmailConfig} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Cấu Hình Tài Khoản Gửi Gmail (Gmail SMTP Sender)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Hệ thống sử dụng giao thức bảo mật Google SMTP (Cổng 465 SSL) kèm Google App Password.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800 text-xs font-mono bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-emerald-200/50">
                <input
                  type="checkbox"
                  checked={gmailConfig?.isEnabled ?? true}
                  onChange={(e) => setGmailConfig((prev) => (prev ? { ...prev, isEnabled: e.target.checked } : null))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kích hoạt điều phối Gmail</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Tên hiển thị người gửi (Sender Name)</label>
                <input
                  type="text"
                  value={gmailConfig?.senderName || ''}
                  onChange={(e) => setGmailConfig((prev) => (prev ? { ...prev, senderName: e.target.value } : null))}
                  placeholder="Cẩm Cù House — Thông Báo Website"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Địa chỉ Gmail gửi (Sender Email)</label>
                <input
                  type="email"
                  value={gmailConfig?.senderEmail || ''}
                  onChange={(e) => setGmailConfig((prev) => (prev ? { ...prev, senderEmail: e.target.value } : null))}
                  placeholder="thuynhu8788@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mật khẩu ứng dụng Google (16-char App Password)</span>
                  </label>
                  {gmailConfig?.hasAppPassword && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Đã lưu mật khẩu ứng dụng
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={appPasswordInput}
                  onChange={(e) => setAppPasswordInput(e.target.value)}
                  placeholder={
                    gmailConfig?.hasAppPassword
                      ? '•••••••••••••••• (Nhập mã 16 ký tự mới nếu muốn thay đổi)'
                      : 'Ví dụ: abcd efgh ijkl mnop (Google App Password 16 ký tự)'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 tracking-wider"
                />
                <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-800 leading-relaxed font-sans flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Hướng dẫn lấy mật khẩu ứng dụng:</strong> Đăng nhập Google Account &rarr; Bảo mật &rarr; Bật Xác minh 2 bước &rarr; Tìm mục &ldquo;Mật khẩu ứng dụng&rdquo; (App Passwords) &rarr; Tạo tên ứng dụng &ldquo;Cam Cu House Website&rdquo; &rarr; Sao chép mã 16 ký tự dán vào đây.
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Reply Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Email Phản Hồi Tự Động Cho Khách Hàng (Auto-Reply)</h4>
                  <p className="text-[11px] text-slate-500">Tự động gửi email xác nhận ngay khi khách hàng để lại thông tin kèm email.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800">
                  <input
                    type="checkbox"
                    checked={gmailConfig?.autoReplyEnabled ?? false}
                    onChange={(e) =>
                      setGmailConfig((prev) => (prev ? { ...prev, autoReplyEnabled: e.target.checked } : null))
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Bật gửi tự động</span>
                </label>
              </div>

              {gmailConfig?.autoReplyEnabled && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Tiêu đề email phản hồi</label>
                    <input
                      type="text"
                      value={gmailConfig?.autoReplySubject || ''}
                      onChange={(e) =>
                        setGmailConfig((prev) => (prev ? { ...prev, autoReplySubject: e.target.value } : null))
                      }
                      placeholder="Cẩm Cù House đã nhận được lời nhắn của bạn"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Nội dung thư cảm ơn</label>
                    <textarea
                      rows={3}
                      value={gmailConfig?.autoReplyBody || ''}
                      onChange={(e) =>
                        setGmailConfig((prev) => (prev ? { ...prev, autoReplyBody: e.target.value } : null))
                      }
                      placeholder="Cảm ơn bạn đã liên hệ Cẩm Cù House. Chúng tôi sẽ phản hồi sớm nhất..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-sans text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SMTP Test & Save Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  placeholder="Nhập email nhận thử (hoặc để trống)"
                  className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl w-64"
                />
                <button
                  type="button"
                  onClick={() => handleTestGmail()}
                  disabled={testingGmail || !gmailConfig?.senderEmail}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {testingGmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Gửi Thử SMTP</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={savingGmailConfig}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold font-mono text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {savingGmailConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Lưu Cấu Hình SMTP</span>
              </button>
            </div>
          </form>

          {/* Card 2: CRUD Recipients Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Danh Sách Hộp Thư Tiếp Nhận Thông Báo Khách Hàng
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Tất cả email đang hoạt động trong danh sách này sẽ nhận được thông báo tức thì khi có khách để lại lời nhắn.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingRecipient({
                    email: '',
                    label: 'Nhân sự tiếp nhận',
                    receiveSubjects: 'ALL',
                    isActive: true,
                  });
                  setRecipientModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Hộp Thư Mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Địa chỉ Email</th>
                    <th className="py-3 px-4">Nhãn phân công / Vị trí</th>
                    <th className="py-3 px-4">Phân quyền nhận chủ đề</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {gmailRecipients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">
                        Chưa có email nào trong danh sách nhận thông báo.
                      </td>
                    </tr>
                  ) : (
                    gmailRecipients.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{r.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-sans font-medium">{r.label}</td>
                        <td className="py-3.5 px-4">
                          {r.receiveSubjects === 'ALL' ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border text-[10px] font-bold">
                              TẤT CẢ CHỦ ĐỀ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              {r.receiveSubjects}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleRecipientActive(r)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              r.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            {r.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            <span>{r.isActive ? 'ĐANG NHẬN TIN' : 'TẠM TẮT'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleTestGmail(r.email)}
                              disabled={testingGmail}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title={`Gửi email kiểm tra tới ${r.email}`}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRecipient(r);
                                setRecipientModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecipient(r.id, r.email)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS TAB */}
      {tab === 'comments' && (
        <div className="space-y-6">
          {/* Top Review Showcase CMS Settings Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Cấu Hình Hiển Thị Đánh Giá Storefront (Hàng Ngang 3 Thẻ)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Điều khiển chế độ hiển thị mục &ldquo;Thực Khách Nói Gì Về Cẩm Cù House&rdquo; tại /khach-hang
                  </p>
                </div>
              </div>

              {/* Pinned Counter Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>
                  Đang ghim hiển thị ngoài web: {comments.filter((c) => c.isFeatured && c.status === 'APPROVED').length} / 3
                </span>
              </div>
            </div>

            {/* Display Mode Selection & Interval */}
            <form onSubmit={handleSaveReviewSettings} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: AUTO_RANDOM */}
                <label
                  onClick={() => setReviewMode('AUTO_RANDOM')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    reviewMode === 'AUTO_RANDOM'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="reviewDisplayMode"
                    value="AUTO_RANDOM"
                    checked={reviewMode === 'AUTO_RANDOM'}
                    onChange={() => setReviewMode('AUTO_RANDOM')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tự động bốc ngẫu nhiên 3 đánh giá (AUTO_RANDOM)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Tự động xáo trộn và bốc 3 đánh giá xác thực khác nhau theo chu kỳ. Tự động tạm dừng khi khách rê chuột đọc (ẩn hoàn toàn nút bấm trên trang khách).
                    </p>
                  </div>
                </label>

                {/* Option 2: MANUAL */}
                <label
                  onClick={() => setReviewMode('MANUAL')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    reviewMode === 'MANUAL'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="reviewDisplayMode"
                    value="MANUAL"
                    checked={reviewMode === 'MANUAL'}
                    onChange={() => setReviewMode('MANUAL')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Thủ công — Chọn cố định 3 đánh giá hiển thị (MANUAL)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Khóa ngoài trang web, chỉ hiển thị đúng 3 đánh giá được Admin bật &ldquo;Ghim hiển thị&rdquo; bên dưới. Khách xem trang web không có nút chuyển.
                    </p>
                  </div>
                </label>
              </div>

              {/* Interval & Save Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <label htmlFor="reviewIntervalInput" className="text-xs font-mono font-medium text-slate-700">
                    Thời gian tự chuyển đổi:
                  </label>
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      id="reviewIntervalInput"
                      type="number"
                      min={3}
                      max={30}
                      value={reviewInterval}
                      onChange={(e) => setReviewInterval(Number(e.target.value) || 6)}
                      className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-mono text-slate-500">giây (3s – 30s, mặc định 6s)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingReviewSettings}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 self-end sm:self-auto disabled:opacity-50"
                >
                  {savingReviewSettings ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{savingReviewSettings ? 'Đang lưu...' : 'Lưu cài đặt hiển thị'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table of Comments */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Danh sách đánh giá thực khách ({comments.length})
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                Hiển thị {comments.filter((c) => c.status === 'APPROVED').length} đánh giá đã duyệt
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Tác giả</th>
                    <th className="py-3 px-4">Đánh giá</th>
                    <th className="py-3 px-4">Nội dung nhận xét</th>
                    <th className="py-3 px-4">Ghim hiển thị</th>
                    <th className="py-3 px-4">Trạng thái duyệt</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comments.map((cm) => (
                    <tr key={cm.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(cm.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div>{cm.authorName}</div>
                        {cm.visitDate && <div className="text-[10px] text-slate-400 font-mono">Ghé: {cm.visitDate}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center text-amber-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < cm.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm text-slate-700">{cm.content}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePinComment(cm.id, Boolean(cm.isFeatured))}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                            cm.isFeatured
                              ? 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-600'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 border border-slate-200'
                          }`}
                          title={cm.isFeatured ? 'Nhấp để bỏ ghim' : 'Ghim hiển thị cố định ngoài web'}
                        >
                          <Star className={`w-3.5 h-3.5 ${cm.isFeatured ? 'fill-current text-white' : 'text-slate-400'}`} />
                          <span>{cm.isFeatured ? '★ Đã ghim' : 'Ghim hiển thị'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={cm.status}
                          onChange={(e) => handleUpdateComment(cm.id, e.target.value, cm.isFeatured)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                            cm.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : cm.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="APPROVED">ĐÃ DUYỆT (Hiển thị)</option>
                          <option value="PENDING">CHỜ DUYỆT</option>
                          <option value="HIDDEN">ẨN</option>
                          <option value="SPAM">SPAM</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteComment(cm.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ANTI-SPAM SHIELD TAB */}
      {tab === 'antispam' && (
        <AdminAntiSpamManager onNotify={showToast} />
      )}

      {/* INTEGRATIONS & TRACKING TAB */}
      {tab === 'integrations' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Quick Chat Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Cấu Hình Nút Hỗ Trợ Nổi Trực Tuyến (Quick Support Widget)
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800">
                <input
                  type="checkbox"
                  checked={settings.enableSupportWidget ?? settings.enableQuickChat ?? true}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings({ ...settings, enableSupportWidget: checked, enableQuickChat: checked });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kích hoạt nút hỗ trợ nổi (Master Switch)</span>
              </label>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Các kênh chỉ hiển thị trong popup hỗ trợ khi công tắc tương ứng được <strong>BẬT</strong> và có đường link/số điện thoại hợp lệ. Tự động ẩn trên trang quản trị.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hotline Channel */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-accent-botanical" />
                    Hotline Trực Tiếp
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.enableHotline ?? true}
                      onChange={(e) => setSettings({ ...settings, enableHotline: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{settings.enableHotline ?? true ? 'Bật' : 'Tắt'}</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.hotlineNumber || settings.quickChatPhone || ''}
                  onChange={(e) => setSettings({ ...settings, hotlineNumber: e.target.value, quickChatPhone: e.target.value })}
                  placeholder="0382851688"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Zalo Channel */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                    Zalo Chat / OA
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.enableZalo ?? true}
                      onChange={(e) => setSettings({ ...settings, enableZalo: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{settings.enableZalo ?? true ? 'Bật' : 'Tắt'}</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.zaloUrl || ''}
                  onChange={(e) => setSettings({ ...settings, zaloUrl: e.target.value })}
                  placeholder="https://zalo.me/0382851688"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Facebook Messenger */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                    Facebook Messenger
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.enableMessenger ?? true}
                      onChange={(e) => setSettings({ ...settings, enableMessenger: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{settings.enableMessenger ?? true ? 'Bật' : 'Tắt'}</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.messengerUrl || ''}
                  onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
                  placeholder="https://m.me/camcuhousedaknong"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* WhatsApp */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp (Quốc tế)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.enableWhatsApp ?? true}
                      onChange={(e) => setSettings({ ...settings, enableWhatsApp: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{settings.enableWhatsApp ?? true ? 'Bật' : 'Tắt'}</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.whatsappUrl || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })}
                  placeholder="https://wa.me/84382851688"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSocialShare ?? true}
                  onChange={(e) => setSettings({ ...settings, enableSocialShare: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Bật nút chia sẻ bài viết (Facebook, Zalo, Copy Link) tại trang Tin tức & Sự kiện</span>
              </label>
            </div>
          </div>

          {/* Tracking Codes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-mono">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Mã Tiếp Thị & Đo Lường (Analytics & Pixel IDs)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Google Analytics 4 (Measurement ID)</label>
                <input
                  type="text"
                  value={settings.gaMeasurementId || ''}
                  onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Google Tag Manager (Container ID)</label>
                <input
                  type="text"
                  value={settings.gtmContainerId || ''}
                  onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Google Search Console Verification (Token hoặc Thẻ Meta)</label>
                <input
                  type="text"
                  value={settings.gscVerification || ''}
                  onChange={(e) => setSettings({ ...settings, gscVerification: extractGoogleSiteVerificationToken(e.target.value) })}
                  placeholder="Dán mã token hoặc toàn bộ thẻ <meta name='google-site-verification' content='...' />"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  value={settings.facebookPixelId || ''}
                  onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                  placeholder="Ví dụ: 123456789012345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={settings.tiktokPixelId || ''}
                  onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                  placeholder="Ví dụ: CXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Lưu Cấu Hình Kênh Tương Tác</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Recipient Add/Edit Modal */}
      {recipientModalOpen && editingRecipient && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRecipient}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 text-xs font-mono"
          >
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingRecipient.id ? 'Sửa Hộp Thư Nhận Thông Báo' : 'Thêm Hộp Thư Nhận Thông Báo'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setRecipientModalOpen(false);
                  setEditingRecipient(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Địa chỉ Email nhận thông báo *</label>
                <input
                  type="email"
                  required
                  value={editingRecipient.email || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, email: e.target.value })}
                  placeholder="vidu@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Tên hiển thị / Vị trí phụ trách</label>
                <input
                  type="text"
                  value={editingRecipient.label || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, label: e.target.value })}
                  placeholder="Quản lý ca / Chăm sóc khách hàng"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Chủ đề tiếp nhận</label>
                <select
                  value={editingRecipient.receiveSubjects || 'ALL'}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, receiveSubjects: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="ALL">Tất cả chủ đề (Mặc định)</option>
                  <option value="Tư vấn chung">Chỉ nhận: Tư vấn chung (General Inquiry)</option>
                  <option value="Đặt BBQ">Chỉ nhận: Đặt BBQ (BBQ Reservation)</option>
                  <option value="Góp ý không gian">Chỉ nhận: Góp ý không gian (Space Feedback)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingRecipient.isActive ?? true}
                    onChange={(e) => setEditingRecipient({ ...editingRecipient, isActive: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Đang hoạt động (nhận thông báo)</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRecipientModalOpen(false);
                  setEditingRecipient(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={savingRecipient}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
              >
                {savingRecipient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Lưu Thông Tin</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Reply Modal */}
      {replyingContact && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendReply}
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 text-xs font-mono"
          >
            <div className="p-5 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">Phản Hồi Thư Khách Hàng Qua Gmail</h3>
                <p className="text-[11px] text-emerald-300 font-sans">
                  Gửi trực tiếp đến: <strong>{replyingContact.email}</strong> ({replyingContact.fullName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingContact(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Tiêu đề thư trả lời</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Nội dung phản hồi chính thức</label>
                <textarea
                  rows={8}
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Tin nhắn gốc của khách:</div>
                <div className="text-[11px] text-slate-700 font-sans italic line-clamp-3">
                  &ldquo;{replyingContact.message}&rdquo;
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Thư sẽ được gửi bằng tên: {gmailConfig?.senderName || 'Cẩm Cù House'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingContact(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow"
                >
                  {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Gửi Thư Phản Hồi</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Chi Tiết Thư Liên Hệ</h3>
              <button onClick={() => setSelectedContact(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Khách gửi</div>
                  <div className="font-bold text-sm text-slate-900">{selectedContact.fullName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Thời gian</div>
                  <div className="text-slate-600">{new Date(selectedContact.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Số điện thoại</div>
                  <div className="font-bold text-emerald-700">
                    <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Email</div>
                  <div className="text-slate-700">{selectedContact.email || '—'}</div>
                </div>
              </div>

              {selectedContact.subject && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Chủ đề</div>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                        selectedContact.subject.includes('BBQ')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : selectedContact.subject.includes('Góp ý')
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {selectedContact.subject}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] text-slate-400 uppercase mb-1">Nội dung thư</div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Trạng thái điều phối Gmail:</div>
                <div className="text-[11px] text-slate-700">
                  {selectedContact.emailStatus === 'SENT' ? (
                    <span className="text-emerald-700 font-bold">✔ Đã gửi tới: {selectedContact.emailSentTo}</span>
                  ) : selectedContact.emailStatus === 'FAILED' ? (
                    <span className="text-red-600 font-bold">✖ Gửi thất bại: {selectedContact.emailError}</span>
                  ) : (
                    <span className="text-amber-600 font-bold">Chưa gửi ({selectedContact.emailStatus || 'NOT_CONFIGURED'})</span>
                  )}
                </div>
                {selectedContact.repliedAt && (
                  <div className="text-[10px] text-emerald-600 mt-1">
                    Đã phản hồi cho khách lúc: {new Date(selectedContact.repliedAt).toLocaleString('vi-VN')}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xoá thư</span>
                </button>
                <div className="flex items-center gap-2">
                  {selectedContact.email && (
                    <button
                      onClick={() => {
                        handleOpenReplyModal(selectedContact);
                        setSelectedContact(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Phản hồi qua email</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
