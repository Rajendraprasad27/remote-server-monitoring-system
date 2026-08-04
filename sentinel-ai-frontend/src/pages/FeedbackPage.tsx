
import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { ICONS } from '../constants';

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    setIsSubmitting(true);
    try {
      await apiService.submitFeedback({ rating, comment });
      setSubmitted(true);
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-in zoom-in-90 duration-500">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-4xl font-bold mb-4">Gratitude Logged</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Your feedback helps us refine Sentinel AI's predictive models. Our engineers will review your notes shortly.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setRating(0); setComment(''); }}
          className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
        >
          Submit Another Note
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-top-4 duration-700">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Feedback Interface</h1>
        <p className="text-slate-400 mt-3 text-lg">How is your experience with the predictive alerting ecosystem?</p>
      </header>

      <div className="glass-card rounded-[2rem] p-10 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-center text-slate-300 text-sm font-bold uppercase tracking-widest mb-6">Select Performance Rating</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setRating(star)} // Interactive feel
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    rating >= star ? 'bg-yellow-500/20 text-yellow-400 scale-110 rotate-3 shadow-xl shadow-yellow-500/10' : 'bg-white/5 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <ICONS.Star className={`w-10 h-10 ${rating >= star ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold uppercase tracking-widest mb-4">Detailed Observations (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-white placeholder-slate-600"
              placeholder="Tell us about performance, UI glitches, or feature requests..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
               <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ICONS.Feedback className="w-6 h-6" />
                Transmit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex justify-center gap-12 text-slate-500">
         <div className="flex flex-col items-center gap-1">
            <span className="font-bold text-white">24h</span>
            <span className="text-[10px] uppercase tracking-widest">SLA Response</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <span className="font-bold text-white">SSL</span>
            <span className="text-[10px] uppercase tracking-widest">Encrypted</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <span className="font-bold text-white">Direct</span>
            <span className="text-[10px] uppercase tracking-widest">SRE Access</span>
         </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
