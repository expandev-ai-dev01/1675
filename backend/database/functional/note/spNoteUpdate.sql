/**
 * @summary
 * Updates an existing note's titulo, conteudo, and cor.
 * Automatically updates dataAtualizacao timestamp.
 *
 * @procedure spNoteUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to update
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Updated note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Updated note content (1-5000 characters)
 *
 * @param {VARCHAR(7)} cor
 *   - Required: Yes
 *   - Description: Updated hexadecimal color code
 *
 * @testScenarios
 * - Valid update of existing note
 * - Validation failure for non-existent note
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Validation failure for invalid cor format
 * - Security validation for cross-account access attempt
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteUpdate]
  @idAccount INTEGER,
  @idNote INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @cor VARCHAR(7)
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
     * @rule {db-note-update} Update note record with validated parameters and timestamp
     */
    BEGIN TRAN;

      UPDATE [functional].[note]
      SET
        [titulo] = @titulo,
        [conteudo] = @conteudo,
        [cor] = @cor,
        [dataAtualizacao] = GETUTCDATE()
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteUpdated, 1, 1}
       * @column {INT} idNote
       * - Description: Updated note identifier
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
