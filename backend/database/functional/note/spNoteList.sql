/**
 * @summary
 * Lists all notes for an account with optional color filtering and ordering.
 * Returns notes ordered by creation date descending by default.
 *
 * @procedure spNoteList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {VARCHAR(7)} filtroCor
 *   - Required: No
 *   - Description: Optional color filter (hexadecimal format)
 *
 * @param {VARCHAR(50)} ordem
 *   - Required: No
 *   - Description: Sort order (data_criacao_asc, data_criacao_desc, titulo_asc, titulo_desc)
 *
 * @testScenarios
 * - List all notes without filters
 * - List notes filtered by specific color
 * - List notes with custom ordering
 * - Validation failure for invalid color format
 * - Validation failure for invalid ordem parameter
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteList]
  @idAccount INTEGER,
  @filtroCor VARCHAR(7) = NULL,
  @ordem VARCHAR(50) = 'data_criacao_desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {filtroCorInvalid}
   */
  IF (@filtroCor IS NOT NULL AND @filtroCor NOT LIKE '#[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]')
  BEGIN
    ;THROW 51000, 'filtroCorInvalid', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {ordemInvalid}
   */
  IF (@ordem NOT IN ('data_criacao_asc', 'data_criacao_desc', 'titulo_asc', 'titulo_desc'))
  BEGIN
    ;THROW 51000, 'ordemInvalid', 1;
  END;

  /**
   * @rule {db-note-list} Retrieve notes with optional filtering and custom ordering
   */
  /**
   * @output {NoteList, n, n}
   * @column {INT} idNote
   * - Description: Note identifier
   * @column {NVARCHAR(100)} titulo
   * - Description: Note title
   * @column {NVARCHAR(MAX)} conteudo
   * - Description: Note content
   * @column {VARCHAR(7)} cor
   * - Description: Note color code
   * @column {DATETIME2} dataCriacao
   * - Description: Creation timestamp
   * @column {DATETIME2} dataAtualizacao
   * - Description: Last update timestamp (nullable)
   */
  SELECT
    [nt].[idNote],
    [nt].[titulo],
    [nt].[conteudo],
    [nt].[cor],
    [nt].[dataCriacao],
    [nt].[dataAtualizacao]
  FROM [functional].[note] [nt]
  WHERE [nt].[idAccount] = @idAccount
    AND ((@filtroCor IS NULL) OR ([nt].[cor] = @filtroCor))
  ORDER BY
    CASE WHEN @ordem = 'data_criacao_desc' THEN [nt].[dataCriacao] END DESC,
    CASE WHEN @ordem = 'data_criacao_asc' THEN [nt].[dataCriacao] END ASC,
    CASE WHEN @ordem = 'titulo_desc' THEN [nt].[titulo] END DESC,
    CASE WHEN @ordem = 'titulo_asc' THEN [nt].[titulo] END ASC;
END;
GO
