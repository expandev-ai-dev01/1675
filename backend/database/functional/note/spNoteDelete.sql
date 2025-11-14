/**
 * @summary
 * Permanently deletes a note from the system.
 * This operation is irreversible and requires explicit confirmation.
 *
 * @procedure spNoteDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to delete
 *
 * @testScenarios
 * - Valid deletion of existing note
 * - Validation failure for non-existent note
 * - Security validation for cross-account access attempt
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteDelete]
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

  BEGIN TRY
    /**
     * @rule {db-note-delete} Permanently remove note record from database
     */
    BEGIN TRAN;

      DELETE FROM [functional].[note]
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteDeleted, 1, 1}
       * @column {INT} idNote
       * - Description: Deleted note identifier
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
