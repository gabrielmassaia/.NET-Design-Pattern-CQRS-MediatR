using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchReference.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRowVersionToObrigacoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Obrigacoes",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Obrigacoes");
        }
    }
}
