/**
 * @summary
 * Retrieves a specific note by its identifier.
 * Returns complete note details including all fields.
 *
 * @procedure spNoteGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier
 *
 * @testScenarios
 * - Valid retrieval of existing note
 * - Validation failure for non-existent note
 * - Security validation for cross-account access attempt
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteGet]
  @idAccount INTEGER,
  @idNote INTEGER
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
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF (@idNote IS NULL)
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {noteNotFound}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[note] [nt]
    WHERE [nt].[idNote] = @idNote
      AND [nt].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'noteNotFound', 1;
  END;

  /**
   * @rule {db-note-get} Retrieve complete note details
   */
  /**
   * @output {NoteDetails, 1, n}
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
  WHERE [nt].[idNote] = @idNote
    AND [nt].[idAccount] = @idAccount;
END;
GO
