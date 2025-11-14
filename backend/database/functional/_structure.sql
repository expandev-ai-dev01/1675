/**
 * @schema functional
 * Business logic schema for NoteDB application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table note Note storage table for user notes
 * @multitenancy true
 * @softDelete false
 * @alias nt
 */
CREATE TABLE [functional].[note] (
  [idNote] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [titulo] NVARCHAR(100) NOT NULL,
  [conteudo] NVARCHAR(MAX) NOT NULL,
  [cor] VARCHAR(7) NOT NULL,
  [dataCriacao] DATETIME2 NOT NULL,
  [dataAtualizacao] DATETIME2 NULL
);
GO

/**
 * @primaryKey pkNote
 * @keyType Object
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [pkNote] PRIMARY KEY CLUSTERED ([idNote]);
GO

/**
 * @check chkNote_Titulo
 * Validates titulo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_Titulo] CHECK (LEN([titulo]) >= 3 AND LEN([titulo]) <= 100);
GO

/**
 * @check chkNote_Conteudo
 * Validates conteudo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_Conteudo] CHECK (LEN([conteudo]) >= 1 AND LEN([conteudo]) <= 5000);
GO

/**
 * @check chkNote_Cor
 * Validates cor format as hexadecimal color code
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_Cor] CHECK ([cor] LIKE '#[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]');
GO

/**
 * @default dfNote_Cor
 * Default color white for notes
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [dfNote_Cor] DEFAULT ('#FFFFFF') FOR [cor];
GO

/**
 * @default dfNote_DataCriacao
 * Auto-generated creation timestamp
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [dfNote_DataCriacao] DEFAULT (GETUTCDATE()) FOR [dataCriacao];
GO

/**
 * @index ixNote_Account
 * @type ForeignKey
 * Multi-tenancy account isolation index
 */
CREATE NONCLUSTERED INDEX [ixNote_Account]
ON [functional].[note]([idAccount]);
GO

/**
 * @index ixNote_Account_DataCriacao
 * @type Performance
 * Optimizes default ordering by creation date
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_DataCriacao]
ON [functional].[note]([idAccount], [dataCriacao] DESC)
INCLUDE ([titulo], [cor]);
GO

/**
 * @index ixNote_Account_Cor
 * @type Search
 * Optimizes filtering by color
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_Cor]
ON [functional].[note]([idAccount], [cor])
INCLUDE ([titulo], [dataCriacao]);
GO
