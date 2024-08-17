import { STATUS } from '$lib/components/Course/components/Lesson/Exercise/constants';
import type { PostgrestError } from '@supabase/supabase-js';
import type { ProfilePathwayProgress } from '$lib/utils/types';
import { supabase } from '$lib/utils/functions/supabase';
import type { Pathway } from '$lib/utils/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export function addPathwayGroupMember(member: any) {
  return supabase.from('groupmember').insert(member).select();
}

export async function updatePathways(
  pathwayId: Pathway['id'],
  avatar: string | undefined,
  pathway: Partial<Pathway>
) {
  if (avatar && pathwayId) {
    const filename = `pathway/${pathwayId + Date.now()}.webp`;

    const { data } = await supabase.storage.from('avatars').upload(filename, avatar, {
      cacheControl: '3600',
      upsert: false
    });

    if (data) {
      const { data: response } = supabase.storage.from('avatars').getPublicUrl(filename);

      if (!response.publicUrl) return;

      pathway.logo = response.publicUrl;
    }
  }

  await supabase.from('pathway').update(pathway).match({ id: pathwayId });

  return pathway.logo;
}

export async function deletePathway(pathwayId: Pathway['id']) {
  return await supabase.from('pathway').update({ status: 'DELETED' }).match({ id: pathwayId });
}

const SLUG_QUERY = `
  id,
  title,
  type,
  description,
  overview,
  logo,
  is_published,
  slug,
  cost,
  currency,
  metadata,
  is_certificate_downloadable,
  certificate_theme,
  courses:course(
    id, title,
  )
`;

const ID_QUERY = `
  id,
  title,
  type,
  description,
  overview,
  logo,
  is_published,
  group(*,
    members:groupmember(*,
      profile(*)
    )
  ),
  slug,
  cost,
  currency,
  metadata,
  is_certificate_downloadable,
  certificate_theme,
  courses:course(
    id, title,public, lesson_at, is_unlocked, order, created_at,
    note, videos, slide_url, call_url, totalExercises:exercise(count), totalComments:lesson_comment(count),
    profile:teacher_id(id, avatar_url, fullname),
    lesson_completion(id, profile_id, is_complete)
  ),
  attendance:group_attendance(*),
`;

export async function fetchPathway(courseId?: Pathway['id'], slug?: Pathway['slug']) {
  const match: { slug?: string; id?: string; status?: string } = {};

  if (slug) {
    match.slug = slug;
  } else {
    match.id = courseId;
  }

  match.status = STATUS[STATUS.ACTIVE];

  const response: PostgrestSingleResponse<Pathway | null> = await supabase
    .from('course')
    .select(slug ? SLUG_QUERY : ID_QUERY)
    .match(match)
    .single();

  const { data, error } = response;

  console.log(`error`, error);
  console.log(`data`, data);
  if (!data || error) {
    console.log(`data`, data);
    console.log(`fetchCourse => error`, error);
    // return this.redirect(307, '/courses');
    return { data, error };
  }

  return {
    data,
    error
  };
}

export async function fetchPathwayCourseProgress(
  pathwayId,
  profileId
): Promise<{
  data: ProfilePathwayProgress[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .rpc('get_course_progress', {
      pathway_id_arg: pathwayId,
      profile_id_arg: profileId
    })
    .returns<ProfilePathwayProgress[]>();

  return { data, error };
}
