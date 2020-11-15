using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class Addsongtables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Songs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(nullable: true),
                    Filename = table.Column<string>(nullable: true),
                    Duration = table.Column<double>(nullable: false),
                    YoutubeUrl = table.Column<string>(nullable: true),
                    AddedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Songs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Songs_Users_AddedByUserId",
                        column: x => x.AddedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StationSongs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SongId = table.Column<int>(nullable: false),
                    StationId = table.Column<int>(nullable: false),
                    AddedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StationSongs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StationSongs_Users_AddedByUserId",
                        column: x => x.AddedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StationSongs_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StationSongs_Stations_StationId",
                        column: x => x.StationId,
                        principalTable: "Stations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Songs_AddedByUserId",
                table: "Songs",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StationSongs_AddedByUserId",
                table: "StationSongs",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StationSongs_SongId",
                table: "StationSongs",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_StationSongs_StationId",
                table: "StationSongs",
                column: "StationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StationSongs");

            migrationBuilder.DropTable(
                name: "Songs");
        }
    }
}
