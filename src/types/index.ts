export type PageStep = 'welcome' | 'dua' | 'final';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}
