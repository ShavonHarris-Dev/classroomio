import Link from 'carbon-icons-svelte/lib/Link.svelte';
import Video from 'carbon-icons-svelte/lib/Video.svelte';
import { t } from '$lib/utils/functions/translations';

export const videoTabs = [
  {
    value: 1,
    title: 'Youtube Link',
    icon: Link
  },
  {
    value: 2,
    title: 'Video',
    icon: Video
  }
];
