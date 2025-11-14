/**
 * @summary
 * Creates a new note with titulo, conteudo, and optional cor.
 * Automatically generates idNote and dataCriacao timestamp.
 *
 * @procedure spNoteCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Note content (1-5000 characters)
 *
 * @param {VARCHAR(7)} cor
 *   - Required: No
 *   - Description: Hexadecimal color code (defaults to #FFFFFF)
 *
 * @returns {INT} idNote - Generated note identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional cor parameter
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Validation failure for invalid cor format
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteCreate]
  @idAccount INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @cor VARCHAR(7) = '#FFFFFF'
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
   * @throw {tituloRequired}
   */
  IF (@titulo IS NULL OR LEN(@titulo) = 0)
  BEGIN
    ;THROW 51000, 'tituloRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {tituloTooShort}
   */
  IF (LEN(@titulo) < 3)
  BEGIN
    ;THROW 51000, 'tituloTooShort', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {tituloTooLong}
   */
  IF (LEN(@titulo) > 100)
  BEGIN
    ;THROW 51000, 'tituloTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {conteudoRequired}
   */
  IF (@conteudo IS NULL OR LEN(@conteudo) = 0)
  BEGIN
    ;THROW 51000, 'conteudoRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {conteudoTooLong}
   */
  IF (LEN(@conteudo) > 5000)
  BEGIN
    ;THROW 51000, 'conteudoTooLong', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {corInvalid}
   */
  IF (@cor NOT LIKE '#[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]')
  BEGIN
    ;THROW 51000, 'corInvalid', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-note-create} Insert new note record with validated parameters
     */
    BEGIN TRAN;

      INSERT INTO [functional].[note] (
        [idAccount],
        [titulo],
        [conteudo],
        [cor],
        [dataCriacao]
      )
      VALUES (
        @idAccount,
        @titulo,
        @conteudo,
        @cor,
        GETUTCDATE()
      );

      /**
       * @output {NoteCreated, 1, 1}
       * @column {INT} idNote
       * - Description: Generated note identifier
       */
      SELECT SCOPE_IDENTITY() AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
