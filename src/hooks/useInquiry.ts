import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export function useInquiry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return async (type: string) => {
    if (!user) {
      toast('Sign in to continue', { description: 'We need your details to follow up.' });
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    const { error } = await supabase.
    from('inquiries').
    insert({ user_id: user.id, email: user.email, type });
    if (error) {
      toast.error('Something went wrong', { description: error.message });
      return;
    }
    toast.success('Request received', { description: `A TACYE advisor will contact you about: ${type}.` });
  };
}