"use client";

import { useState } from "react";
import { Mail, Clock, User, Trash2 } from "lucide-react";
import { messages as initialMessages } from "@/lib/data";

export default function AdminMessages() {
  const [msgs, setMsgs] = useState(initialMessages);
  const [selected, setSelected] = useState<number | null>(null);

  const selectedMsg = msgs.find((m) => m.id === selected);

  const markRead = (id: number) => {
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">Messages</h1>
        <p className="text-slate-400 text-sm">{msgs.filter((m) => !m.read).length} unread messages</p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Message list */}
        <div className="md:col-span-2 space-y-2">
          {msgs.map((msg) => (
            <button
              key={msg.id}
              onClick={() => { setSelected(msg.id); markRead(msg.id); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selected === msg.id
                  ? "bg-blue-600/20 border-blue-600/50"
                  : msg.read
                  ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-slate-900 border-blue-800/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-sm font-medium ${!msg.read ? "text-white" : "text-slate-300"}`}>
                  {msg.name}
                </span>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1" />}
              </div>
              <p className="text-slate-400 text-xs truncate mb-1">{msg.subject}</p>
              <span className="text-slate-600 text-xs font-mono">{msg.date}</span>
            </button>
          ))}
        </div>

        {/* Message detail */}
        <div className="md:col-span-3">
          {selectedMsg ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white font-semibold">{selectedMsg.subject}</h3>
                  <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                    <span className="flex items-center gap-1"><User size={12} /> {selectedMsg.name}</span>
                    <span>{selectedMsg.email}</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                    <Clock size={11} /> {selectedMsg.date}
                  </span>
                </div>
                <button className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-300 leading-relaxed text-sm">{selectedMsg.message}</p>
              </div>
              <div className="mt-4">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  <Mail size={14} /> Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center text-slate-500">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
