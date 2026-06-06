using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mist.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserAndGenerationFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "AspNetUsers");

            migrationBuilder.CreateIndex(
                name: "IX_generation_generation_user_id",
                table: "generation",
                column: "generation_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_generation_AspNetUsers_generation_user_id",
                table: "generation",
                column: "generation_user_id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_generation_AspNetUsers_generation_user_id",
                table: "generation");

            migrationBuilder.DropIndex(
                name: "IX_generation_generation_user_id",
                table: "generation");

            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
