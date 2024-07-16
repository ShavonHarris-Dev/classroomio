CREATE TABLE IF NOT EXISTS "public"."pathway" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "group_id" "uuid",
    "is_template" boolean DEFAULT true,
    "logo" "text" DEFAULT ''::"text" NOT NULL,
    "slug" character varying,
    "landingpage" "jsonb" DEFAULT '{"goals": "", "description": "", "requirements": ""}'::"jsonb" NOT NULL,
    "settings" "jsonb" DEFAULT '{"is_certificate_downloadable": false, "certificate_theme": "", "requirements": ""}'::"jsonb" NOT NULL,
    "cost" bigint DEFAULT '0'::bigint,
    "currency" character varying DEFAULT 'NGN'::character varying NOT NULL,
    "banner_image" "text",
    "is_published" boolean DEFAULT false,
    "status" "text" DEFAULT 'ACTIVE'::"text" NOT NULL
);
ALTER TABLE "public"."pathway" OWNER TO "postgres";
ALTER TABLE ONLY "public"."pathway"
    ADD CONSTRAINT "pathway_pkey" PRIMARY KEY ("id");
    
GRANT ALL ON TABLE "public"."pathway" TO "anon";
GRANT ALL ON TABLE "public"."pathway" TO "authenticated";
GRANT ALL ON TABLE "public"."pathway" TO "service_role";


CREATE TABLE IF NOT EXISTS "public"."pathway_course" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "order" bigint,
    "pathway_id" "uuid",
    "course_id" "uuid"
);
ALTER TABLE "public"."pathway_course" OWNER TO "postgres";
ALTER TABLE ONLY "public"."pathway_course"
    ADD CONSTRAINT "pathway_course_pkey" PRIMARY KEY ("id");

GRANT ALL ON TABLE "public"."pathway_course" TO "anon";
GRANT ALL ON TABLE "public"."pathway_course" TO "authenticated";
GRANT ALL ON TABLE "public"."pathway_course" TO "service_role";

ALTER TABLE ONLY "public"."pathway_course"
    ADD CONSTRAINT "pathway_course_pathway_id_fkey" FOREIGN KEY ("pathway_id") REFERENCES "public"."pathway"("id");

ALTER TABLE ONLY "public"."pathway_course"
    ADD CONSTRAINT "pathway_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id");
