import hasura, { sql } from '../imports/hasura';

export const ntn = process.env.NODES__TABLE_NAME || 'nodes';
export const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
export const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

export const UP_IS_ROOT = sql`CREATE OR REPLACE FUNCTION ${nmptn}__is_root(node_id integer) RETURNS boolean AS $$
DECLARE result BOOLEAN;
BEGIN
  SELECT COUNT("id") >= 1
  INTO result
  FROM
  "${nmptn}"
  WHERE
  "item_id" = node_id AND
  "path_item_id" = node_id AND
  "path_item_depth" = 0
  LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql;`;

export const UP_INSERT = sql`CREATE OR REPLACE FUNCTION ${nmptn}__insert_node__function()
RETURNS TRIGGER AS $trigger$
DECLARE
  fromFlow RECORD;
  toFlow RECORD;
  positionId TEXT;
BEGIN
  IF (NEW."from_id" IS NOT NULL OR NEW."to_id" IS NOT NULL)
  THEN
    -- IL
    -- ILTR
    IF (SELECT * FROM ${nmptn}__is_root(NEW."to_id"))
    THEN
      -- ILS
      FOR fromFlow
      IN (
        -- find all .from flows
        SELECT fromFlowItem.*
        FROM "${nmptn}" as fromFlowItem
        WHERE
        fromFlowItem."item_id" = NEW."from_id" AND
        fromFlowItem."path_item_id" = NEW."from_id"
      )
      LOOP
        SELECT gen_random_uuid() INTO positionId;

        -- spread to link
        INSERT INTO "${nmptn}"
        ("item_id","path_item_id","path_item_depth","root_id","position_id")
        SELECT
        NEW."id",
        fromItemPath."path_item_id",
        fromItemPath."path_item_depth",
        fromItemPath."root_id",
        positionId
        FROM "${nmptn}" AS fromItemPath
        WHERE
        fromItemPath."item_id" = fromFlow."item_id" AND
        fromItemPath."root_id" = fromFlow."root_id";

        INSERT INTO "${nmptn}"
        ("item_id","path_item_id","path_item_depth","root_id","position_id")
        VALUES
        (NEW."id", NEW."id", fromFlow."path_item_depth" + 1, fromFlow."root_id", positionId);

        FOR toFlow
        IN (
          -- find all .to and down nodes
          SELECT toFlowItem.*
          FROM "${nmptn}" as toFlowItem
          WHERE
          toFlowItem."root_id" = NEW."to_id" AND
          toFlowItem."path_item_depth" = 0
        )
        LOOP
          SELECT gen_random_uuid() INTO positionId;

          -- toFlow."item_id"

          -- clone root flow path with move depth
          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          SELECT
          toItemPath."item_id",
          toItemPath."path_item_id",
          toItemPath."path_item_depth" + fromFlow."path_item_depth" + 2,
          fromFlow."root_id",
          positionId
          FROM "${nmptn}" AS toItemPath
          WHERE
          toItemPath."position_id" = toFlow."position_id";

          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          VALUES
          (toFlow."item_id", NEW."id", fromFlow."path_item_depth" + 1, fromFlow."root_id", positionId);

          -- fill path in moved area
          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          SELECT
          toFlow."item_id",
          fromItemPath."path_item_id",
          fromItemPath."path_item_depth",
          fromItemPath."root_id",
          positionId
          FROM "${nmptn}" AS fromItemPath
          WHERE
          fromItemPath."item_id" = fromFlow."item_id" AND
          fromItemPath."root_id" = fromFlow."root_id";

        END LOOP;

        -- ILTFD
        DELETE FROM "${nmptn}"
        WHERE "root_id" = NEW."to_id";
      END LOOP;
    ELSE
      -- ILTRF
      -- ILS
      FOR fromFlow
      IN (
        -- find all .from flows
        SELECT fromFlowItem.*
        FROM "${nmptn}" as fromFlowItem
        WHERE
        fromFlowItem."item_id" = NEW."from_id" AND
        fromFlowItem."path_item_id" = NEW."from_id"
      )
      LOOP
        SELECT gen_random_uuid() INTO positionId;

        -- spread to link
        INSERT INTO "${nmptn}"
        ("item_id","path_item_id","path_item_depth","root_id","position_id")
        SELECT
        NEW."id",
        fromItemPath."path_item_id",
        fromItemPath."path_item_depth",
        fromItemPath."root_id",
        positionId
        FROM "${nmptn}" AS fromItemPath
        WHERE
        fromItemPath."item_id" = fromFlow."item_id" AND
        fromItemPath."root_id" = fromFlow."root_id";

        INSERT INTO "${nmptn}"
        ("item_id","path_item_id","path_item_depth","root_id","position_id")
        VALUES
        (NEW."id", NEW."id", fromFlow."path_item_depth" + 1, fromFlow."root_id", positionId);

        FOR toFlow
        IN (
          -- ILTD ONLY DIFFERENCE!!!
          -- find all nodes of link flows next
          SELECT
          DISTINCT ON (nodesFlowPath."item_id") nodesFlowPath."item_id",
          nodesFlowPath."id",
          nodesFlowPath."path_item_id",
          nodesFlowPath."path_item_depth",
          nodesFlowPath."root_id",
          nodesFlowPath."position_id"
          FROM "${nmptn}" as nodesFlowPath
          WHERE
          nodesFlowPath."path_item_id" = NEW."to_id"
        )
        LOOP
          SELECT gen_random_uuid() INTO positionId;

          -- toFlow."item_id"

          -- clone root flow path with move depth
          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          SELECT
          toItemPath."item_id",
          toItemPath."path_item_id",
          toItemPath."path_item_depth" + fromFlow."path_item_depth" + 2,
          fromFlow."root_id",
          positionId
          FROM "${nmptn}" AS toItemPath
          WHERE
          toItemPath."position_id" = toFlow."position_id" AND
          toItemPath."path_item_depth" >= toFlow."path_item_depth";

          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          VALUES
          (toFlow."item_id", NEW."id", fromFlow."path_item_depth" + 1, fromFlow."root_id", positionId);

          -- fill path in moved area
          INSERT INTO "${nmptn}"
          ("item_id","path_item_id","path_item_depth","root_id","position_id")
          SELECT
          toFlow."item_id",
          fromItemPath."path_item_id",
          fromItemPath."path_item_depth",
          fromItemPath."root_id",
          positionId
          FROM "${nmptn}" AS fromItemPath
          WHERE
          fromItemPath."item_id" = fromFlow."item_id" AND
          fromItemPath."root_id" = fromFlow."root_id";

        END LOOP;
      END LOOP;
    END IF;
  ELSE
    -- IN
    -- INR
    -- INRR
    INSERT INTO "${nmptn}"
    ("item_id","path_item_id","path_item_depth","root_id","position_id")
    VALUES
    (NEW."id",NEW."id",0,NEW."id",gen_random_uuid());
  END IF;
  RETURN NEW;
END;
$trigger$ LANGUAGE plpgsql;`;

export const UP_WILL_ROOT = sql`CREATE OR REPLACE FUNCTION ${nmptn}__will_root(node_id integer, link_id integer) RETURNS boolean AS $$
DECLARE result BOOLEAN;
BEGIN
  SELECT COUNT("id") = 0
  INTO result
  FROM
  "nodes"
  WHERE
  "to_id" = node_id AND
  "id" != link_id
  LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql;`;

export const UP_DELETE = sql`CREATE OR REPLACE FUNCTION ${nmptn}__will_root(node_id integer, link_id integer) RETURNS boolean AS $$
DECLARE result BOOLEAN;
BEGIN
  SELECT COUNT("id") = 0
  INTO result
  FROM
  "nodes"
  WHERE
  "to_id" = node_id AND
  "id" != link_id
  LIMIT 1;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ${nmptn}__delete_node__function()
RETURNS TRIGGER AS $trigger$
DECLARE
  linkFlow RECORD;
  nodesFlow RECORD;
BEGIN
  IF (OLD."from_id" IS NOT NULL OR OLD."to_id" IS NOT NULL)
  THEN
    -- DL
    IF (SELECT * FROM ${nmptn}__will_root(OLD."to_id", OLD."id"))
    THEN
      -- DLWRF
      FOR nodesFlow
      IN (
        -- find all nodes of link flows next
        SELECT
        DISTINCT ON (nodesFlowPath."item_id") nodesFlowPath."item_id",
        nodesFlowPath."id",
        nodesFlowPath."path_item_id",
        nodesFlowPath."path_item_depth",
        nodesFlowPath."root_id",
        nodesFlowPath."position_id"
        FROM "${nmptn}" as nodesFlowPath
        WHERE
        nodesFlowPath."path_item_id" = OLD."id"
      )
      LOOP
        DELETE FROM "${nmptn}"
        WHERE
        "position_id" = nodesFlow."position_id" AND
        "path_item_depth" <= nodesFlow."path_item_depth";

        UPDATE "${nmptn}"
        SET
        "path_item_depth" = "path_item_depth" - (nodesFlow."path_item_depth" + 1),
        "root_id" = OLD."to_id"
        WHERE "position_id" = nodesFlow."position_id";
      END LOOP;

      -- DLWRF
      FOR linkFlow
      IN (
        -- find all path items of link next
        SELECT linkFlowPath.*
        FROM "${nmptn}" as linkFlowPath
        WHERE
        linkFlowPath."path_item_id" = OLD."id"
      )
      LOOP
        DELETE FROM "${nmptn}"
        WHERE "position_id" = linkFlow."position_id";
      END LOOP;

    ELSE
      -- DLWRF
      FOR linkFlow
      IN (
        -- find all path items of link next
        SELECT linkFlowPath.*
        FROM "${nmptn}" as linkFlowPath
        WHERE
        linkFlowPath."path_item_id" = OLD."id"
      )
      LOOP
        DELETE FROM "${nmptn}"
        WHERE "position_id" = linkFlow."position_id";
      END LOOP;

    END IF;
  ELSE
  END IF;

  -- DN
  DELETE FROM "${nmptn}"
  WHERE "item_id" = OLD."id";

  RETURN OLD;
END;
$trigger$ LANGUAGE plpgsql;`;

export const UP_TRIGGERS = `CREATE TRIGGER ${nmptn}__delete_node__trigger AFTER DELETE ON "${ntn}" FOR EACH ROW EXECUTE PROCEDURE ${nmptn}__delete_node__function();

CREATE TRIGGER ${nmptn}__insert_node__trigger AFTER INSERT ON "${ntn}" FOR EACH ROW EXECUTE PROCEDURE ${nmptn}__insert_node__function();`;

export const DOWN_TRIGGERS = `DROP TRIGGER IF EXISTS ${nmptn}__delete_node__trigger ON ${ntn};
DROP TRIGGER IF EXISTS ${nmptn}__insert_node__trigger ON ${ntn}`;
export const DOWN_IS_ROOT = `DROP FUNCTION IF EXISTS ${nmptn}__is_root;`;
export const DOWN_INSERT = `DROP FUNCTION IF EXISTS ${nmptn}__insert_node__function`;
export const DOWN_WILL_ROOT = `DROP FUNCTION IF EXISTS ${nmptn}__will_root;`;
export const DOWN_DELETE = `DROP FUNCTION IF EXISTS ${nmptn}__delete_node__function`;

export const up = async () => {
  await hasura.sql(UP_IS_ROOT);
  await hasura.sql(UP_INSERT);
  await hasura.sql(UP_WILL_ROOT);
  await hasura.sql(UP_DELETE);
  await hasura.sql(UP_TRIGGERS);
};

export const down = async () => {
  await hasura.sql(DOWN_TRIGGERS);
  await hasura.sql(DOWN_IS_ROOT);
  await hasura.sql(DOWN_INSERT);
  await hasura.sql(DOWN_WILL_ROOT);
  await hasura.sql(DOWN_DELETE);
};
