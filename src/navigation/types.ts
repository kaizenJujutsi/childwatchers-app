import { Watcher } from '../data/mockWatchers';

export type RootStackParamList = {
  Splash: undefined;
  ParentTabs: undefined;
  WatcherTabs: undefined;
  WatcherProfile: { watcher: Watcher };
  BookPay: { watcher: Watcher };
  Login: undefined;
  Register: { role: 'parent' | 'watcher' };
  ParentVerification: undefined;
  TrainingVideo: { title: string; description: string; videoUrl: string; moduleId: string };
};

export type ParentTabParamList = {
  Home: undefined;
  FindWatchers: undefined;
  SOSCenter: undefined;
};

export type WatcherTabParamList = {
  WatcherHome: undefined;
  WagesWallet: undefined;
  WatcherVetting: undefined;
};
