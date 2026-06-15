CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level SecurityALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Grant Data API access to service_role (full access)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;

-- Grant only necessary operations to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

-- Create policies for authenticated users
CREATE POLICY "tasks_select_policy" ON public.tasks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_policy" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_policy" ON public.tasks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_policy" ON public.tasks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);