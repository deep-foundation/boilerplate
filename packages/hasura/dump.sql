
--
-- Name: nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."nodes" (
    id integer NOT NULL,
    from_id integer,
    to_id integer,
    type integer
);

alter table public."nodes" add constraint "nodes_pkey" primary key ("id");

--
-- Name: nodes__mp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."nodes__mp" (
    id integer NOT NULL,
    item_id integer NOT NULL,
    path_item_id integer NOT NULL,
    path_item_depth integer NOT NULL,
    root_id integer NOT NULL,
    position_id text DEFAULT public.gen_random_uuid() NOT NULL
);

alter table public."nodes__mp" add constraint "nodes__mp_pkey" primary key ("id");

--
-- Name: nodes__mp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."nodes__mp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes__mp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."nodes__mp_id_seq" OWNED BY public."nodes__mp".id;


--
-- Name: nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."nodes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."nodes_id_seq" OWNED BY public."nodes".id;


--
-- Name: nodes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."nodes" ALTER COLUMN id SET DEFAULT nextval('public.nodes_id_seq'::regclass);


--
-- Name: nodes__mp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."nodes__mp" ALTER COLUMN id SET DEFAULT nextval('public.nodes__mp_id_seq'::regclass);
